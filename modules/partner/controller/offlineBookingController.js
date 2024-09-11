const OfflineBookingService = require("../services/shared/offlineBookingService")

class OfflineBookingController {
    async createOfflineBooking(req, res) {
        try {
          
            const { username, phoneNumber, carId , amount, carComapny, carModel, pickUpDate, returnDate } = req.body;
            const result = await OfflineBookingService.createOfflineBooking({
                username,
                phoneNumber,
                carId,
                amount,
                carComapny,
                carModel,
                pickUpDate,
                returnDate
            });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllOfflineBookings(req, res) {
        try {
            const { limit, page } = req.query;
            const bookings = await OfflineBookingService.getAllOfflineBookings({
                limit: parseInt(limit),
                page: parseInt(page)
            });
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
}

module.exports = new  OfflineBookingController();
