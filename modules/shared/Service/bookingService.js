const CarBooking = require("../model/booking");
const User = require("../../user/model/user")
class BookingService {
  cancelBooking = async ({ userType, bookingId, cancelReason }) => {
    try {
      console.log("Starting booking cancellation process");
  
      // Find the booking by its ID
      const booking = await CarBooking.findById(bookingId);
      console.log("Booking found:", booking);
  
      if (!booking) {
        console.log("Booking not found for ID:", bookingId);
        return { error: "Booking not found", statusCode: 404 };
      }
  
      if (booking.isCancel) {
        console.log("Booking already cancelled");
        return { error: "Booking has already been cancelled", statusCode: 400 };
      }
  
      // Set booking cancellation details
      booking.status = "cancelled";
      booking.cancelBy = userType;
      booking.cancelReason = cancelReason;
      booking.isCancel = true;
  
      // Fixed refund amount
      const refundAmount = 100;
      console.log("Refund amount:", refundAmount);
  
      if (userType === "user" || userType === "partner") {
        console.log("Finding user with ID:", booking.userId);
  
        const user = await User.findById(booking.userId);
        console.log("User found:", user);
  
        if (!user) {
          console.log("User not found for ID:", booking.userId);
          return { error: "User not found", statusCode: 404 };
        }
  
        // Update wallet balance with the refund amount
        user.walletBalance += refundAmount;
        console.log("Updated wallet balance:", user.walletBalance);
  
        await user.save();
        console.log("User wallet balance saved");
      }
  
      await booking.save();
      console.log("Booking cancellation saved successfully");
  
      return { message: "Booking cancelled successfully" };
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return { error: "Internal Server Error", statusCode: 500 };
    }
  };
  
  
      
  
    
  
    getBooking = async ({ entityType, entityId, status, page, limit }) => {
        let query = {};
        if (entityType === 'User') {
            query.userId = entityId;
        } else if (entityType === 'Partner') {
            query.partnerId = entityId;
        } else {
            throw new Error('Invalid entityType');
        }
    
      
        
        try {
      
            const totalDocuments = await CarBooking.countDocuments(query).exec();
            
            const bookings = await CarBooking.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("userId", 'emailAddress phoneNumber firstName lastName')
                .populate("partnerId", 'emailAddress phoneNumber firstName lastName')
                .exec();
    
    
               
    
            const totalPages = Math.ceil(totalDocuments / limit);
    
            return {
                totalDocuments,
                totalPages,
                currentPage: page,
                limit,
                bookings
            };
        } catch (error) {
            console.error("Error retrieving bookings:", error);
            return {
                message: "Error retrieving bookings",
                error: error.message,
            };
        }
    } 
}
module.exports = new BookingService();
