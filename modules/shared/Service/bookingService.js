const CarBooking = require("../model/booking");
const User = require("../../user/model/user")
const Partner = require("../../partner/model/partner")
class BookingService {
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
  
  
      const user = await User.findById(booking.userId);
       
        if (!user) {
      
          return { error: "User not found", statusCode: 404 };
        }
  
        // Update wallet balance with the refund amount
        user.walletBalance += booking.summary.subTotal;
       
        await user.save();

        const partner = await Partner.findById(booking.partnerId);
        if(!partner){
          return { error: "Partner not found", statusCode: 404 };
        }
        partner.walletBalance -= booking.summary.subTotal

        await partner.save()
      await booking.save();
  
  
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
