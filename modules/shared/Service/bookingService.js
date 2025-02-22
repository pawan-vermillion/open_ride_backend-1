const CarBooking = require("../model/booking");
const User = require("../../user/model/user");
const Partner = require("../../partner/model/partner");
const WalletHistory = require("../../user/model/walletBalance");
const moment = require("moment");
const mongoose = require("mongoose");
const WalletBalance = require("../../user/model/walletBalance");
const Driver = require("../../partner/model/driver");

class BookingService {
  canCancelBooking = async (booking) => {
    const bookingTime = moment(booking.bookingTime);
    const currentTime = moment();
    const hoursDifference = currentTime.diff(bookingTime, "hours");

    // Allow cancellation within 3 hours
    return hoursDifference <= 3;
  };

  cancelBooking = async ({ userType, bookingId, cancelReason }) => {
    try {
      const booking = await CarBooking.findById(bookingId);

      if (!booking) {
        return { error: "Booking not found", statusCode: 404 };
      }

      if (booking.isCancel) {
        return { error: "Booking has already been cancelled", statusCode: 400 };
      }

      // Set booking cancellation details
      booking.status = "cancelled";
      booking.cancelBy = userType;
      booking.cancelReason = cancelReason;
      booking.isCancel = true;

      const savedBooking = await booking.save();
      const user = await User.findById(booking.userId);

      if (!user) {
        return { error: "User not found", statusCode: 404 };
      }
      const netAmount = booking.summary.subTotal - booking.summary.discount;
      // Update wallet balance with the refund amount
      user.walletBalance += netAmount;
      await user.save();

      const transactionType = "Credit";

      try {
        const walletHistoryEntry = new WalletBalance({
          userId: booking.userId,
          partnerId: booking.partnerId,
          transactionType,
          paymentId:booking.paymentDetails.paymentId,
          amount: netAmount,
          bookingId: booking._id,
        });

        await walletHistoryEntry.save();
      } catch (walletHistoryError) {
        return { error: "Failed to save wallet history", statusCode: 500 };
      }

      // amount delete in partner

      const partner = await Partner.findById(booking.partnerId);
      if (!partner) {
        return { error: "Partner not found", statusCode: 404 };
      }

     


      const updatedDriver = await Driver.updateOne(
        { _id: booking.assignedDriver, "trips.bookingId": bookingId }, 
        { $set: { "trips.$.status": "completed" } }
      );
     

      return { message: "Booking cancelled successfully" };
    } catch (error) {
      console.log(error)
      return { error: "Internal Server Error", statusCode: 500 };
    }
  };

  

  getBooking = async ({ entityType, entityId, status, page, limit }) => {
    let query = {};
    if (entityType === "User") {
      query.userId = entityId;
    } else if (entityType === "Partner") {
      query.partnerId = entityId;
    } else {
      throw new Error("Invalid entityType");
    }

    if (status !== "all") {
      query.status = status;
    }

    try {
      const totalDocuments = await CarBooking.countDocuments(query).exec();

      const rawBookings = await CarBooking.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId", "emailAddress phoneNumber firstName lastName")
        .populate("partnerId", "emailAddress phoneNumber firstName lastName")
        .populate("assignedDriver", "firstName lastName phoneNumber age driverImage")
        .populate({
          path: "carId",
          select:
            "carNumber companyName modelName subModel bodyStyle exteriorImage modelYear ",
          populate: [
            { path: "companyName", select: "carCompany" },
            { path: "modelName", select: "model" },
            { path: "subModel", select: "subModel" },
            { path: "bodyStyle", select: "bodyStyle" },
           
          ],
        })
        .exec();
        const bookings = await Promise.all(
          rawBookings.map(async (booking) => {
            const carId = booking.carId;
    
            // Calculate average rating inside API
            const avgRating = await mongoose
              .model("CarReview")
              .aggregate([
                { $match: { carId: carId?._id } },
                { $group: { _id: null, averageRating: { $avg: "$rating" } } },
              ])
              .then((result) => (result[0]?.averageRating || 0));
    
            return {
              ...booking._doc,
              bookingId: booking._id,
              user: {
                userId: booking.userId?._id, // Include userId separately
                firstName: booking.userId?.firstName,
                lastName: booking.userId?.lastName,
                emailAddress: booking.userId?.emailAddress,
                phoneNumber: booking.userId?.phoneNumber,
              },
              carId: {
                carId: carId?._id,
                carNumber: carId?.carNumber,
                carCompany: carId?.companyName?.carCompany,
                model: carId?.modelName?.model,
                subModel: carId?.subModel?.subModel,
                bodyStyle: carId?.bodyStyle?.bodyStyle,
                exteriorImage: carId?.exteriorImage?.[0],
                modelYear: carId?.modelYear,
                averageRating: avgRating, // Add the calculated average rating
              },
              
            };
          })
        );
    
        const totalPages = Math.ceil(totalDocuments / limit);

    
        return {
          totalDocuments,
          totalPages,
          currentPage: page,
          limit,
          bookings,
        };
      } catch (error) {
        return {
          message: "Error retrieving bookings",
          error: error.message,
        };
      }
  };

  getBookingByBookingId = async ({ bookingId }) => {
    try {
      const booking = await CarBooking.findById(bookingId)
        .populate("carId", "modelName  companyName bodyStyle")
        .populate("partnerId", "phoneNumber emailAddress  firstName lastName")
        .populate("userId", "phoneNumber emailAddress  firstName lastName");

      if (!booking) {
        throw new Error("Booking not found");
      }

      return booking;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = new BookingService();
