const CarBooking = require("../../../shared/model/booking")

class CheckStatusBookingService {
    partnerGetBooking = async ({ status, partnerId, page, limit }) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;

            
            const query = { partnerId };
            if (status && status !== 'all') {
                query.status = status;
            }
       
            const total = await CarBooking.countDocuments(query);
            

            const booking = await CarBooking.find(query).populate("partnerId", 'emailAddress phoneNumber firstName lastName').populate("userId", 'emailAddress phoneNumber firstName lastName').populate("carId", 'carNumber companyName modelName subModel')
                .skip(skip)
                .limit(pageSize);

            return {
                page: currentPage,
                limit: pageSize,
                total: total,
                booking,
            };
        } catch (error) {
            throw error;
        }
    }
    userGetBooking = async ({ status, userId, page, limit }) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;

            
            const query = { userId };
            if (status && status !== 'all') {
                query.status = status;
            }
       
            const total = await CarBooking.countDocuments(query);
           

            const booking = await CarBooking.find(query).populate("userId", 'emailAddress phoneNumber firstName lastName')
                .skip(skip)
                .limit(pageSize);

            return {
                page: currentPage,
                limit: pageSize,
                total: total,
                booking,
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CheckStatusBookingService();
