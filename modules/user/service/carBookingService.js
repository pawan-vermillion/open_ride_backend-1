const CarBooking = require("../../shared/model/booking");
const Car = require("../../partner/model/car");
const moment = require("moment");
const crypto = require("crypto");
const Partner = require("../../partner/model/partner");
const walletHistory = require("../../partner/model/walletHistory");
const OfflineBooking = require("../../partner/model/offlineBooking");
const CarDetails = require("../../partner/model/car");
const User = require("../model/user");
const { type } = require("os");
const WalletBalance = require("../model/walletBalance");
const razorpay = require("razorpay");
const carCompany = require("../../admin/model/carCompany");
const RazorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

  verifyPayment = async ({ orderId, paymentId, signature }) => {
    try {
      const body = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature === signature) {
        const payment = await RazorpayInstance.payments.fetch(paymentId);
        if (payment.status === "captured") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error("Payment Verification Error:", error);
      return false;
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
      console.log(booking)
  
      const partner = await Partner.findById(booking.partnerId);
      if (!partner) {
        throw new Error("Partner not found");
      }
  
      const userAmount = booking.summary.userAmmount
    
      
      if (userAmount <= 0) {
        booking.status = "pending";
        booking.paymentDetails.isPaymentVerified = true;
        booking.paymentDetails.paymentId = paymentId || `direct-${Date.now()}`;
        booking.paymentDetails.orderId = orderId || `direct-${Date.now()}`;
        await booking.save();
  
        const totalAmount =
          booking.summary.subTotal -
          booking.summary.discount -
          booking.summary.commisionAmmount -
          booking.summary.totalTax;
  
      
        partner.walletBalance =
          (parseFloat(partner.walletBalance) || 0) + totalAmount;
  
        const partnerWalletHistory = new walletHistory({
          partnerId: booking.partnerId,
          userId: booking.userId,
          bookingId: booking._id,
          transactionType: "Credit",
          genratedBookingId: booking.genratedBookingId,
          UiType: "Wallet",
          status: "Confirmed",
          isWithdrewble: false,
          amount: totalAmount,
        });
  
        await partnerWalletHistory.save();
        await partner.save();
  
        return {
          success: true,
          message: "Payment directly verified and booking updated successfully.",
          booking,
        };
      }
  
     
      const isPaymentVerified = await this.verifyPayment({
        orderId,
        paymentId,
        signature,
      });
   
  
      if (!isPaymentVerified) {
        throw new Error("Payment verification failed");
      }
  
      booking.status = "pending";
      booking.paymentDetails.isPaymentVerified = true;
      booking.paymentDetails.paymentId = paymentId;
      booking.paymentDetails.orderId = orderId;
      await booking.save();
  
      const totalAmount =
        booking.summary.subTotal -
        booking.summary.discount -
        booking.summary.commisionAmmount -
        booking.summary.totalTax;
  
      let walletBalance = parseFloat(
        (await User.findById(booking.userId))?.walletBalance || 0
      );
  
      const amountToDeduct = Math.min(walletBalance, userAmount);
      if (amountToDeduct > 0) {
        walletBalance -= amountToDeduct;
        await User.findByIdAndUpdate(booking.userId, { walletBalance });
  
        const userWalletHistory = new WalletBalance({
          partnerId: booking.partnerId,
          userId: booking.userId,
          bookingId: booking._id,
          transactionType: "Debit",
          paymentId: booking.genratedBookingId,
          amount: amountToDeduct,
        });
        await userWalletHistory.save();
      }
  
      partner.walletBalance =
        (parseFloat(partner.walletBalance) || 0) + totalAmount;
  
      const partnerWalletHistory = new walletHistory({
        partnerId: booking.partnerId,
        userId: booking.userId,
        bookingId: booking._id,
        transactionType: "Credit",
        genratedBookingId: booking.genratedBookingId,
        UiType: "Wallet",
        status: "Confirmed",
        isWithdrewble: false,
        amount: totalAmount,
      });
  
      await partnerWalletHistory.save();
      await partner.save();
  
      return booking;
    } catch (error) {
      console.error(error);
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

  haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  async searchCar({
    pickUpDate,
    pickUpTime,

    returnDate,
    returnTime,
    filters,
    pagination,
    latitude,
    longitude,
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

      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;

      const pickUpDateTime = moment(
        `${pickUpDate} ${pickUpTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const returnDateTime = moment(
        `${returnDate} ${returnTime}`,
        "YYYY-MM-DD HH:mm"
      );

      if (
        !pickUpDate ||
        !pickUpTime ||
        !returnDate ||
        !returnTime ||
        !latitude ||
        !longitude
      ) {
        throw new Error("All mandatory fields must be provided.");
      }

      if (pickUpDateTime.isBefore(moment(), "minute")) {
        throw new Error("Pick-up date and time cannot be in the past.");
      }

      if (returnDateTime.isBefore(pickUpDateTime)) {
        throw new Error("Return date cannot be before pick-up date.");
      }

      let query = {
        isCarVarified: true,
        isDelete: false,
      };

      const carsQuery = CarDetails.find(query)
        .populate("companyName", "carCompany logoImage")
        .populate("modelName", "model")
        .populate("subModel", "subModel")
        .populate("bodyStyle", "bodyStyle")
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const cars = await carsQuery;

      let filteredCars = cars;

      if (price) filteredCars = filteredCars.filter((car) => car.rate <= price);
      if (model)
        filteredCars = filteredCars.filter(
          (car) => car?.modelName?.model === model
        );
      if (company)
        filteredCars = filteredCars.filter(
          (car) => car?.companyName?.carCompany === company
        );
      if (carType)
        filteredCars = filteredCars.filter(
          (car) => car?.bodyStyle?.bodyStyle === carType
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

      const availableCars = [];

      const pickUpMoment = moment(`${pickUpDate} ${pickUpTime}`, "YYYY-MM-DD HH:mm");
      const returnMoment = moment(`${returnDate} ${returnTime}`, "YYYY-MM-DD HH:mm");
  
      // Check availability for the filtered cars
      for (const car of cars) {
        const availability = await this.checkAvailabilityForRange({
          carId: car._id,
          startDate: pickUpMoment.format("YYYY-MM-DD"),
          endDate: returnMoment.format("YYYY-MM-DD"),
          startTime: pickUpMoment.format("HH:mm"),
          endTime: returnMoment.format("HH:mm"),
        });
  
        if (availability) {
          const carLatitude = car.latitude;
          const carLongitude = car.longitude;
  
          const distance = this.haversineDistance(
            latitude,
            longitude,
            carLatitude,
            carLongitude
          );
  
          if (distance <= 30) {
            availableCars.push({ car, distance });
          }
        }
      }
  
      // Sort by distance
      availableCars.sort((a, b) => a.distance - b.distance);

      const result = availableCars.map(({ car, distance }) => ({
        carId: car._id,
        carModel: car.modelName.model,
        price: car.rate,
        carCompany: car.companyName.carCompany,
        carSubModel: car.subModel.subModel,
        bodyStyle: car.bodyStyle.bodyStyle,
        rating: car.rating,
        exteriorImage: car.exteriorImage[0],
        noOfSeat: car.numberOfSeat,
        fuelType: car.fuelType,
        door: car.numberOfDoors,
        modelYear: car.modelYear,
        transmission: car.transmission,
        distance,
        isCarVarified: car.isCarVarified,
      }));

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getBookingSummary = async ({ userId, carId, data }) => {
    try {
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
      const userWalletBalanceDoc = await User.findById(userId);
      let walletBalance = parseFloat(userWalletBalanceDoc?.walletBalance || 0);

      let userAmount = subTotal - discount;
      const amountToDeduct = Math.min(walletBalance, userAmount);

      if (walletBalance > 0) {
        walletBalance -= amountToDeduct;
        userAmount -= amountToDeduct;
      }

      const netAmount = subTotal - discount;

      const commisionRate = parseFloat(process.env.COMMISSION_RATE) || 10;
      const commisionAmmount = parseFloat((netAmount * commisionRate) / 100);

      const sgstRate = parseFloat(process.env.SGST_RATE) || 9;
      const cgstRate = parseFloat(process.env.CGST_RATE) || 9;
      const sgst = parseFloat((commisionAmmount * (sgstRate / 100)).toFixed(2));
      const cgst = parseFloat((commisionAmmount * (cgstRate / 100)).toFixed(2));
      const totalTax = parseFloat((sgst + cgst).toFixed(2));
      const bookingOtp = Math.floor(1000 + Math.random() * 9000);
      const partnerAmmount = parseFloat(
        (netAmount - commisionAmmount - totalTax).toFixed(2)
      );

      const genratedBookingId = Math.floor(100000 + Math.random() * 900000);

      let orderId;
      do {
        orderId = crypto.randomBytes(16).toString("hex");
      } while (await CarBooking.exists({ "summary.orderId": orderId }));
      const bookingData = {
        carId,
        partnerId: car.partnerId,
        userId,
        pickUpData: data,
        genratedBookingId: genratedBookingId,
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
          userAmmount: userAmount,
          walletBalance,
          orderId,
          totalCommisionTax: commisionAmmount + sgst + cgst,
          totalTax,
          bookingOtp,
        },
        bookedDates,
        status: "pending",
        expiresAt: moment().add(30, "minutes").toDate(),
      };



      const booking = new CarBooking(bookingData);
      const populatedCarDetails = await Car.findById(carId).populate([
        { path: "companyName", select: "carCompany" }, // Adjust the fields you want to populate
        { path: "modelName", select: "CarModel" },
        { path: "bodyStyle", select: "bodyStyle" },
        { path: "subModel", select: "subModel" },
      ]);
      const populatedCar = { carId: carId,
        carCompany: populatedCarDetails?.companyName?.carCompany, // Example field
        carModel: populatedCarDetails?.modelName?.model,
        bodyStyle: populatedCarDetails?.bodyStyle?.bodyStyle,
        carSubModel: populatedCarDetails?.subModel?.subModel,
        modelYear: populatedCarDetails?.modelYear,
        isCarVarified: populatedCarDetails?.isCarVarified,
        rating: populatedCarDetails?.rating,
        exteriorImage: populatedCarDetails?.exteriorImage[0],
        noOfSeat: populatedCarDetails?.numberOfSeat,
        fuelType: populatedCarDetails?.fuelType,
        price: populatedCarDetails?.rate,
        transmission: populatedCarDetails?.transmission,
      
      }

      console.log(populatedCar)
    
      await booking.save();

      return {booking,populatedCar};
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  };
}

module.exports = new CarBookingService();
