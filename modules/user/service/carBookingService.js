const CarBooking = require("../../shared/model/booking");
const Car = require("../../partner/model/car");
const moment = require("moment");
const crypto = require("crypto");
const Partner = require("../../partner/model/partner");
const walletHistory = require("../../partner/model/walletHistory");
const OfflineBooking = require("../../partner/model/offlineBooking");
const CarDetails = require("../../partner/model/car");

class CarBookingService {
  generateDateRange = (start, end) => {
    const startDate = moment(start);
    const endDate = moment(end);
    const dates = [];

    while (startDate.isSameOrBefore(endDate)) {
      dates.push(startDate.format("YYYY-MM-DD"));
      startDate.add(1, "day");
    }

    return dates;
  };

  checkCarAvailable = async ({ carId }) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);

      const bookings = await CarBooking.find({ carId }).select(
        "bookedDates  isCancel"
      );
      const offlineBookings = await OfflineBooking.find({ carId }); //for offline  booking

      const bookedDates = bookings.flatMap((booking) =>
        !booking.isCancel
          ? booking.bookedDates.map((date) => date.toISOString().split("T")[0])
          : []
      );
      //for offline  booking
      const offlineDates = offlineBookings.flatMap((booking) =>
        this.generateDateRange(booking.pickUpDate, booking.returnDate)
      );
      const checkDates = [];
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        checkDates.push(date.toISOString().split("T")[0]);
      }

      return checkDates.map((date) => ({
        date: date,
        isAvailable:
          !bookedDates.includes(date) && !offlineDates.includes(date),
      }));
    } catch (error) {
      throw new Error(`Error checking car availability: ${error.message}`);
    }
  };

  removeExpiredBookings = async () => {
    try {
      const now = new Date();
      await CarBooking.deleteMany({
        status: "pending",
        expiresAt: { $lt: now },
      });
    } catch (error) {
      throw new Error(`Error removing expired bookings: ${error.message}`);
    }
  };

  bookingVerification = async ({
    orderId,
    paymentId,
    signature,
    bookingId,
  }) => {
    try {
      const booking = await CarBooking.findById({ _id: bookingId });

      if (!booking) {
        throw new Error("Booking not found");
      }

      const isPaymentVerified = await this.verifyPayment({
        orderId,
        paymentId,
        signature,
      });
      if (!isPaymentVerified) {
        throw new Error("Payment verification failed");
      }

      booking.status = "confirmed";
      booking.paymentDetails.isPaymentVerified = true;
      booking.paymentDetails.paymentId = paymentId;
      booking.paymentDetails.orderId = orderId;
      await booking.save();

      const partner = await Partner.findById(booking.partnerId);
      if (!partner) {
        throw new Error("Partner not found");
      }

      const totalAmount =
        booking.summary.subTotal -
        booking.summary.discount -
        booking.summary.commisionAmmount -
        booking.summary.totalTax;

      // Update partner's wallet balance
      partner.walletBalance =
        (parseFloat(partner.walletBalance) || 0) + totalAmount;

      const userId = booking.userId;
      const transactionType = "Credit";

      const walletHistoryEntry = new walletHistory({
        partnerId: booking.partnerId,
        userId,
        transactionType,
        amount: totalAmount,
        bookingId: booking._id,
      });

      await walletHistoryEntry.save();

      await partner.save().catch((err) => console.error("Save Error:", err));
      return booking;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  checkAvailabilityForRange = async ({
    carId,
    startDate,
    endDate,
    startTime,
    endTime,
  }) => {
    try {
      const startDateTime = new Date(`${startDate}T${startTime}:00`);
      const endDateTime = new Date(`${endDate}T${endTime}:00`);

      const bookings = await CarBooking.find({ carId }).select(
        "pickUpData returnData isCancel"
      );
      const offlineBookings = await OfflineBooking.find({ carId });

      const bookedRanges = bookings
        .filter((booking) => !booking.isCancel)
        .map((booking) => ({
          start: new Date(
            `${booking.pickUpData.pickUpDate}T${booking.pickUpData.pickUpTime}`
          ),
          end: new Date(
            `${booking.returnData.returnDate}T${booking.returnData.returnTime}`
          ),
        }));

      const offlineRanges = offlineBookings.map((booking) => ({
        start: new Date(booking.pickUpDate),
        end: new Date(booking.returnDate),
      }));

      const allRanges = [...bookedRanges, ...offlineRanges];

      // Check if the car is available for the entire range
      const isAvailable = !allRanges.some(
        (range) =>
          (startDateTime >= range.start && startDateTime < range.end) || // Overlaps at start
          (endDateTime > range.start && endDateTime <= range.end) || // Overlaps at end
          (range.start >= startDateTime && range.end <= endDateTime) // Fully inside
      );

      return isAvailable;
    } catch (error) {
      throw new Error(`Error checking car availability: ${error.message}`);
    }
  };

  async searchCar({
    pickUpDate,
    pickUpTime,
    pickupLocation,
    returnDate,
    returnTime,
    filters,
    pagination,
  }) {
    try {
      const {
        price,
        model,
        company,
        carType,
        seat,
        door,
        modelYear,
        transmission,
        fuelType,
      } = filters || {};

      // Set default pagination values if not provided
      const page = pagination?.page || 1; // Default to page 1 if not provided
      const limit = pagination?.limit || 10; // Default to 10 items per page if not provided

      const pickUpDateTime = moment(
        `${pickUpDate} ${pickUpTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const returnDateTime = moment(
        `${returnDate} ${returnTime}`,
        "YYYY-MM-DD HH:mm"
      );

      // Validate mandatory fields
      if (
        !pickUpDate ||
        !pickUpTime ||
        !returnDate ||
        !returnTime ||
        !pickupLocation
      ) {
        throw new Error("All mandatory fields must be provided.");
      }

      // Validate date-time
      if (pickUpDateTime.isBefore(moment(), "minute")) {
        throw new Error("Pick-up date and time cannot be in the past.");
      }

      if (returnDateTime.isBefore(pickUpDateTime)) {
        throw new Error("Return date cannot be before pick-up date.");
      }

      // Query for cars based on pickUpLocation and other mandatory fields
      let query = {
        address: { $regex: pickupLocation, $options: "i" }, // Case-insensitive search on address
        isCarVarified: true,
        isDelete: false,
      };

      // Step 2: Query database for cars based on location and availability
      const carsQuery = CarDetails.find(query)
        .populate("companyName", "carCompany logoImage")
        .populate("modelName", "model")
        .populate("subModel", "subModel")
        .populate("bodyStyle", "bodyStyle")
        .skip((page - 1) * limit) // Skip based on page
        .limit(Number(limit)); // Limit the number of records

      const cars = await carsQuery;

      // Step 3: Apply optional filters to the results
      let filteredCars = cars;
      if (price) filteredCars = filteredCars.filter((car) => car.rate <= price);
      if (model)
        filteredCars = filteredCars.filter(
          (car) => car.modelName.model === model
        );
      if (company)
        filteredCars = filteredCars.filter(
          (car) => car.companyName.carCompany === company
        );
      if (carType)
        filteredCars = filteredCars.filter(
          (car) => car.bodyStyle.bodyStyle === carType
        );
      if (seat)
        filteredCars = filteredCars.filter((car) => car.numberOfSeat == seat);
      if (door)
        filteredCars = filteredCars.filter((car) => car.numberOfDoors == door);
      if (modelYear)
        filteredCars = filteredCars.filter(
          (car) => car.modelYear === modelYear
        );
      if (transmission)
        filteredCars = filteredCars.filter(
          (car) => car.transmission === transmission
        );
      if (fuelType)
        filteredCars = filteredCars.filter((car) => car.fuelType === fuelType);

      // Step 4: Check car availability for the given date-time range
      const availableCars = [];
      for (const car of filteredCars) {
        const availability = await this.checkAvailabilityForRange({
          carId: car._id,
          startDate: pickUpDateTime.format("YYYY-MM-DD"),
          endDate: returnDateTime.format("YYYY-MM-DD"),
          startTime: pickUpDateTime.format("HH:mm"),
          endTime: returnDateTime.format("HH:mm"),
        });

        if (availability) {
          // Directly use the boolean result
          availableCars.push(car);
        }
      }

      //   if (availableCars.length === 0) {
      //     throw new Error("No cars available for the selected dates and times.");
      //   }

      // Prepare response with available cars
      const result = availableCars.map((car) => ({
        carId: car._id,
        modelName: car.modelName.model,
        price: car.rate,
        companyName: car.companyName.carCompany,
        subModelName: car.subModel.subModel,
        bodyStyle: car.bodyStyle.bodyStyle,
        avgRating: car.rating,
        carImage: car.exteriorImage[0],
        seat: car.numberOfSeat,
        fuelType: car.fuelType,
        door: car.numberOfDoors,
        modelYear: car.modelYear,
        transmission: car.transmission,
      }));

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getBookingSummary = async ({ userId, carId, data }) => {
    try {
      // const { pickUpData } = data;

      const car = await Car.findOne({ _id: carId, isDelete: false });
      if (!car) {
        throw new Error("Car Not Found or is deleted");
      }

      const pickUpMoment = moment(
        `${data.pickUpDate} ${data.pickUpTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const returnMoment = moment(
        `${data.returnDate} ${data.returnTime}`,
        "YYYY-MM-DD HH:mm"
      );
      if (pickUpMoment.isBefore(moment(), "minute")) {
        throw new Error("Pickup date and time cannot be in the past");
      }

      if (returnMoment.isBefore(moment(), "minute")) {
        throw new Error("Return date and time cannot be in the past");
      }
      // New validation check
      if (returnMoment.isBefore(pickUpMoment)) {
        throw new Error("Return date cannot be before the pick-up date");
      }

      const availability = await this.checkAvailabilityForRange({
        carId,
        startDate: pickUpMoment.format("YYYY-MM-DD"),
        endDate: returnMoment.format("YYYY-MM-DD"),
        startTime: pickUpMoment.format("HH:mm"),
        endTime: returnMoment.format("HH:mm"),
      });
      console.log(availability);

      if (!availability) {
        throw new Error("Car is not available for the selected dates");
      }

      const bookedDates = this.generateDateRange(
        pickUpMoment.format("YYYY-MM-DD"),
        returnMoment.format("YYYY-MM-DD")
      );
      const totalHour = returnMoment.diff(pickUpMoment, "hours");
      let subTotal = car.rate * totalHour;
      const discount = 0;

      const userAmmount = parseFloat(subTotal - discount);
      const commisionRate = parseFloat(process.env.COMMISSION_RATE) || 10;
      const commisionAmmount = parseFloat((userAmmount * commisionRate) / 100);

      const sgstRate = parseFloat(process.env.SGST_RATE) || 9;
      const cgstRate = parseFloat(process.env.CGST_RATE) || 9;
      const sgst = parseFloat((commisionAmmount * (sgstRate / 100)).toFixed(2));
      const cgst = parseFloat((commisionAmmount * (cgstRate / 100)).toFixed(2));
      const totalTax = parseFloat((sgst + cgst).toFixed(2));

      const partnerAmmount = parseFloat(
        (userAmmount - commisionAmmount - totalTax).toFixed(2)
      );

      let orderId;
      do {
        orderId = crypto.randomBytes(16).toString("hex");
      } while (await CarBooking.exists({ "summary.orderId": orderId }));
      const bookingData = {
        carId,
        partnerId: car.partnerId,
        userId,
        pickUpData: data,

        returnData: data,
        summary: {
          unit: "Hour",
          rate: car.rate,
          totalHour,
          subTotal: parseFloat(subTotal),
          discount,
          taxRate: sgstRate + cgstRate,
          commisionRate,
          sgst,
          cgst,
          commisionAmmount,
          partnerAmmount,
          userAmmount,
          orderId,
          totalCommisionTax: commisionAmmount + sgst + cgst,
          totalTax,
        },
        bookedDates,
        status: "pending",
        expiresAt: moment().add(30, "minutes").toDate(),
      };

      const booking = new CarBooking(bookingData);
      await booking.save();

      return booking;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  };

  // Check car availability for a date range

  // Generate a range of dates between start and end
}

module.exports = new CarBookingService();
