const CarBooking = require("../../shared/model/booking");
const CarBookingService = require("../service/carBookingService");
const razorpay = require("razorpay");
const RazorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class CarBookingController {
  async checkAvailability(req, res) {
    try {
      const { carId } = req.params;

      if (!carId) {
        return res.status(400).json({ error: "carId is required" });
      }

      const availability = await CarBookingService.checkCarAvailable({ carId });

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

      if (!data) {
        return res
          .status(400)
          .json({ error: "Missing required booking details" });
      }

      const bookingSummary = await CarBookingService.getBookingSummary({
        userId,
        carId,
        data,
      });

      res.status(201).json({ message: "success", bookingSummary });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { orderId, paymentId, signature, bookingId } = req.body;

      const result = await CarBookingService.bookingVerification({
        orderId,
        paymentId,
        signature,
        bookingId,
      });

      res
        .status(200)
        .json({ message: "Payment verified successfully", booking: result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async bookCar(req, res) {
    try {
      const { pickUpDate, pickUpTime, pickupLocation, returnDate, returnTime } =
        req.body;

      const {
        price,
        model,
        company,
        carType,
        seat,
        modelYear,
        transmission,
        fuelType,
        page,
        limit,
      } = req.query;

      const result = await CarBookingService.searchCar({
        pickUpDate,
        pickUpTime,
        pickupLocation,
        returnDate,
        returnTime,
        filters: {
          price,
          model,
          company,
          carType,
          seat,
          modelYear,
          transmission,
          fuelType,
        },
        pagination: { page, limit },
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createPayment(req, res) {
  
    const { amount, bookingId, genratedPaymentId } = req.body;
    try {
    
      const checkBooking = await CarBooking.findOne({_id:bookingId});
      if (!checkBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
    
   

      const orderOptions = {
        amount: amount * 100,
        currency: "INR",
        receipt: genratedPaymentId,
        payment_capture: 1,
      };

      console.log(amount * 100)

      RazorpayInstance.orders.create(orderOptions, async (err, order) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error creating Razorpay order", details:err });
        }

        checkBooking.paymentDetails.reciptNumber = genratedPaymentId;

        await checkBooking.save();

        return res.status(200).json({
          success: true,
          message: "Razorpay order created successfully",
          orderId: order.id,
          bookingId,
          amount,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error while creating Razorpay order" });
    }
  }
}

module.exports = new CarBookingController();
