const CheckStatusBookingService = require("../../services/shared/checkStatusBookingService")

class CheckStatusBookingController {
    PartnerCheckStausBooking = async (req, res) => {
        try {
            const { status, partnerId } = req.params;

            const { limit, page } = req.query;
            const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'all'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: `Invalid status: '${status}` });
            }

            const result = await CheckStatusBookingService.partnerGetBooking({ partnerId, status, page, limit });
            res.status(200).json(result);
        } catch (error) {
            return {
                message: "Error retrieving bookings",
                error: error.message,
            };
        }
    }

    UserCheckStausBooking = async (req, res) => {
        try {
           
            const { status, userId } = req.params;
           
            const { limit, page } = req.query;

            const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'all'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: `Invalid status: '${status}` });
            }

            const result = await CheckStatusBookingService.userGetBooking({ userId, status, page, limit });
            res.status(200).json(result);
        } catch (error) {
            return {
                message: "Error retrieving bookings",
                error: error.message,
            };
        }
    }
}
module.exports = new CheckStatusBookingController()
