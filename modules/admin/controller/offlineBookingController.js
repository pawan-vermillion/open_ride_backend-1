
const OfflineBookingService = require("../../partner/services/shared/offlineBookingService")


class OfflineBookingController {

    getAllOfflineBookings = async (req, res) => {
        try {
            const partnerId = req.params.id; 
            const { limit, page } = req.query; 

            const bookings = await OfflineBookingService.getAllOfflineBookings({ partnerId, limit, page });

            if (!bookings || bookings.bookings.length === 0) {
                return res.status(404).json({ message: "No offline bookings found for this vendor." });
            }

            return res.status(200).json(bookings);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error retrieving offline bookings." });
        }
    };


}
module.exports = new OfflineBookingController()