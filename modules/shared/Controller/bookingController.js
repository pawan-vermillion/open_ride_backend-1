
const BookingService = require("../Service/bookingService")

class BookingController {
  cancelBooking = async (req, res) => {
    const { userType, cancelReason } = req.body;
    const bookingId = req.params.bookingId;

    if (!bookingId) {
      return res.status(400).json({ error: "bookingId is required" });
    }

    

    try {
      const result = await BookingService.cancelBooking({ userType, bookingId, cancelReason });

      if (result.error) {
        return res.status(result.statusCode).json({ error: result.error });
      }

      return res.json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  getBookingController = async (req, res) => {
    try {
        const { status } = req.params;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const entityType = req.type;
        const entityId = req.user.id;

        // console.log("Entity Type:", entityType);
        // console.log("Entity ID:", entityId);
        // console.log("Status:", status);

        const validStatuses = ['pending', 'confirmed', 'complete', 'cancelled', 'all'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status: '${status}` });
        }

        const result = await BookingService.getBooking({ entityType, entityId, status, page, limit });
        res.status(200).json(result); 
    } catch (error) {
        console.error("Error retrieving bookings:", error);
        res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
}


}

module.exports = new BookingController();
