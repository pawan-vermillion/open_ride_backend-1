
const CarBookingService = require('../service/carBookingService');


class CarBookingController {
    async checkAvailability(req, res) {
      try {
        const { carId } = req.params;

        if (!carId) {
            return res.status(400).json({ error: 'carId is required' });
        }

        const availability = await CarBookingService.checkCarAvailable({carId});
      
        res.status(200).json(availability);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

    async getBookingController(req, res) {
      try {
          const userId = req.user.id;
          const carId = req.params.carId;
          const data = req.body;
         
  
          
          if (!data.pickUpData || !data.returnData) {
              return res.status(400).json({ error: 'Missing required booking details' });
          }
  
          const bookingSummary = await CarBookingService.getBookingSummary({ userId, carId, data });
  
          res.status(201).json({ message: "success", bookingSummary });
      } catch (error) {
        
          res.status(500).json({ message: error.message });
      }
  }

  async verifyPayment(req, res) {
    try {
        const { orderId, paymentId, signature, bookingId } = req.body;
        
        const result = await CarBookingService.bookingVerification({ orderId, paymentId, signature, bookingId });

        res.status(200).json({ message: 'Payment verified successfully', booking: result });
    } catch (error) {
    
        res.status(500).json({ message: error.message });
    }
}
}
 

  
  
  module.exports = new CarBookingController();

