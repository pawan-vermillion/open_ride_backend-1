const CarBooking = require("../model/booking");

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

            booking.status = "cancelled";
            booking.cancelBy = userType;
            booking.cancelReason = cancelReason;
            booking.isCancel = true;

            await booking.save();

            return { message: "Booking cancelled Successfully" };

        } catch (error) {

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
    
        if (status && status !== 'all') {
            query.status = status.toLowerCase();
        }
    
        try {
      
            const totalDocuments = await CarBooking.countDocuments(query).exec();
            
            const bookings = await CarBooking.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("userId", 'emailAddress phoneNumber firstName lastName')
                .populate("partnerId", 'emailAddress phoneNumber firstName lastName')
                .exec();
    
            
    
                if (bookings.length === 0) {
                    console.log("No bookings found for the given criteria.");
                } 
    
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
