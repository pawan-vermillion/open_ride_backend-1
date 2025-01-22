const Driver = require("../../partner/model/driver");
const Partner = require("../../partner/model/partner");
const walletHistory = require("../../partner/model/walletHistory");
const CarBooking = require("../model/booking");
const BookingService = require("../Service/bookingService");

class BookingController {
  cancelBooking = async (req, res) => {
    const { userType, cancelReason } = req.body;
    const bookingId = req.params.bookingId;

    if (!bookingId) {
      return res.status(400).json({ error: "bookingId is required" });
    }

    try {
      const booking = await CarBooking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Check if cancellation is allowed based on time
      const canCancel = await BookingService.canCancelBooking(booking);

      if (!canCancel) {
        return res
          .status(400)
          .json({
            error:
              "Cancellation is only allowed within 3 hours of the booking time",
          });
      }

      const result = await BookingService.cancelBooking({
        userType,
        bookingId,
        cancelReason,
      });

      if (result.error) {
        return res.status(result.statusCode).json({ message: result.error });
      }

      return res.json({ message: result.message });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getBookingController = async (req, res) => {
    try {
      const { status } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const entityType = req.type;
      const entityId = req.user.id;

      const validStatuses = [
        "pending",
        "confirmed",
        "complete",
        "cancelled",
        "all",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status: '${status}` });
      }

      const result = await BookingService.getBooking({
        entityType,
        entityId,
        status,
        page,
        limit,
      });
      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving bookings", error: error.message });
    }
  };

  getBookingByBookingId = async (req, res) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res.status(400).json({ message: "Booking ID is required" });
      }

      const booking = await BookingService.getBookingByBookingId({ bookingId });

      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  changeBookingStatus = async (req, res) => {
    try {
      const driverId = req.params.driverId;
      const { status, bookingId, bookingOtp } = req.body;

      // Validate status
      if (!["confirmed", "completed"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be 'confirmed' or 'completed'" });
      }

      // Validate driverId and bookingId
      if (!driverId && status === "confirmed" && !bookingId) {
        return res
          .status(400)
          .json({ message: "Driver ID is required for confirmed status" });
      }

      // Fetch the booking
      const checkBooking = await CarBooking.findById(bookingId);
      if (!checkBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Fetch the driver
      const checkDriver = await Driver.findById(driverId);
      if (!checkDriver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      // Validate status transitions
      if (status === "confirmed" && checkBooking.status !== "pending") {
        return res
          .status(400)
          .json({
            message: "Booking status must be 'pending' for confirmation",
          });
      }
   
      if (status === "completed" && checkBooking.status !== "confirmed") {
        return res
          .status(400)
          .json({
            message: "Booking status must be 'confirmed' for completion",
          });
      }

      // Validate bookingOtp if status is 'completed'
      if (status === "completed") {
        if (!bookingOtp) {
          return res
            .status(400)
            .json({
              message: "Booking OTP is required for completing the booking",
            });
        }

        if (checkBooking.summary.bookingOtp !== parseInt(bookingOtp)) {
          return res.status(400).json({ message: "Invalid OTP provided" });
        }
      }

      // Handle 'confirmed' status
      if (status === "confirmed") {
        const pickupDateTime = new Date(
          `${checkBooking.pickUpData.pickUpDate} ${checkBooking.pickUpData.pickUpTime}`
        );
        const returnDateTime = new Date(
          `${checkBooking.returnData.returnDate} ${checkBooking.returnData.returnTime}`
        );

        const overlappingTrip = checkDriver.trips.find((trip) => {
          const tripFromDateTime = new Date(trip.fromDateTime);
          const tripToDateTime = new Date(trip.toDateTime);
          return (
            trip.status !== "completed" &&  pickupDateTime < tripToDateTime && returnDateTime > tripFromDateTime
          );
        });

        if (overlappingTrip) {
          return res
            .status(400)
            .json({
              message: "Driver is not available for the selected time slot",
            });
        }

        const updatedBooking = await CarBooking.updateOne(
          { _id: bookingId },
          { $set: { status: "confirmed", assignedDriver: driverId } }
        );

        if (updatedBooking.nModified === 0) {
          return res
            .status(400)
            .json({ message: "Failed to update the booking" });
        }

        const tripDetails = {
          bookingId: bookingId,
          fromDateTime: pickupDateTime,
          toDateTime: returnDateTime,
          status: "pending",
        };

        const updatedDriver = await Driver.updateOne(
          { _id: driverId },
          { $push: { trips: tripDetails } }
        );

        if (updatedDriver.nModified === 0) {
          return res
            .status(400)
            .json({ message: "Failed to update the driver's trips" });
        }

        return res
          .status(200)
          .json({
            message:
              "Booking status updated to 'confirmed', driver assigned, and trip added successfully",
          });
      }

      // Handle 'completed' status
      if (status === "completed") {
        const updatedBooking = await CarBooking.updateOne(
          { _id: bookingId },
          { $set: { status: "complete" } }
        );

      
        const booking = await CarBooking.findById({ _id: bookingId });
        const totalAmount =
          booking.summary.subTotal -
          booking.summary.discount -
          booking.summary.commisionAmmount -
          booking.summary.totalTax;
        
        const partner = await Partner.findById(booking.partnerId);
        if (!partner) {
          throw new Error("Partner not found");
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
          isWithdrewble: true,
          amount: totalAmount,
        });
        console.log(partnerWalletHistory)
  
        await partnerWalletHistory.save();
        await partner.save();




        if (updatedBooking.nModified === 0) {
          return res
            .status(400)
            .json({ message: "Failed to update the booking" });
        }

        const updatedDriver = await Driver.updateOne(
          { _id: driverId, "trips.bookingId": bookingId },
          { $set: { "trips.$.status": "completed" } }
        );

        if (updatedDriver.nModified === 0) {
          return res
            .status(400)
            .json({ message: "Failed to update the driver's trip status" });
        }



        return res
          .status(200)
          .json({
            message:
              "Booking status updated to 'completed' and driver's trip status updated successfully", partnerWallet:Math.round(partner.walletBalance)
          });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({
          message: "Error updating booking and driver status",
          error: error.message,
        });
    }
  };
}

module.exports = new BookingController();
