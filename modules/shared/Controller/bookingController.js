const CarBooking = require("../model/booking");
const BookingService = require("../Service/bookingService")

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
        return res.status(400).json({ error: "Cancellation is only allowed within 3 hours of the booking time" });
      }

      const result = await BookingService.cancelBooking({ userType, bookingId, cancelReason });

      if (result.error) {
        return res.status(result.statusCode).json({ error: result.error });
      }

      return res.json({ message: result.message });
    } catch (error) {
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



      const validStatuses = ['pending', 'confirmed', 'complete', 'cancelled', 'all'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status: '${status}` });
      }

      const result = await BookingService.getBooking({ entityType, entityId, status, page, limit });
      res.status(200).json(result);
    } catch (error) {

      res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
  }


  
  getBookingByBookingId = async (req, res) => {
    try {
      const { bookingId } = req.params;

  
      if (!bookingId) {
          return res.status(400).json({ message: "Booking ID is required" });
      }

     
      const booking = await BookingService.getBookingByBookingId({bookingId});

 
      res.status(200).json(booking);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}
  }



module.exports = new BookingController();
