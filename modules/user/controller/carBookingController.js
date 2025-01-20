const Partner = require("../../partner/model/partner");
const walletHistory = require("../../partner/model/walletHistory");
const CarBooking = require("../../shared/model/booking");
const User = require("../model/user");
const WalletBalance = require("../model/walletBalance");
const CarBookingService = require("../service/carBookingService");
const razorpay = require("razorpay");
const RazorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createPayment = async (amount, bookingId, genratedPaymentId)=> {
   

  try {
    const checkBooking = await CarBooking.findOne({ _id: bookingId });
    if (!checkBooking) {
      throw new Error("Booking not found");
    }

    // Check if the amount is <= 0
    if (amount <= 0) {
      // Directly handle booking and payment logic
      const booking = await CarBooking.findById({ _id: bookingId });
      if (!booking) {
        throw new Error("Booking not found");
      }

      const partner = await Partner.findById(booking.partnerId);
      if (!partner) {
        throw new Error("Partner not found"); 
      }

      booking.status = "unPaid";
      booking.paymentDetails.isPaymentVerified = true;
      booking.paymentDetails.paymentId = genratedPaymentId; // Use the provided generated payment ID
      booking.paymentDetails.orderId = genratedPaymentId; // Use the same ID for consistency
      await booking.save();

      const totalAmount =
        booking.summary.subTotal -
        booking.summary.discount -
        booking.summary.commisionAmmount -
        booking.summary.totalTax;

      let userAmount = booking.summary.subTotal - booking.summary.discount;

      const userId = booking.userId;
      const userWalletBalanceDoc = await User.findById(userId);
      let walletBalance = parseFloat(
        userWalletBalanceDoc?.walletBalance || 0
      );

      const amountToDeduct = Math.min(walletBalance, userAmount);
 
      if (amountToDeduct > 0) {
        walletBalance -= amountToDeduct;
        userAmount -= amountToDeduct;

        // await User.findByIdAndUpdate(userId, { walletBalance });

        const userWalletHistory = new WalletBalance({
          partnerId: booking.partnerId,
          userId,
          bookingId: booking._id,
          transactionType: "Debit",
          paymentId: booking.genratedBookingId,
          amount: amountToDeduct,
        });
        // await userWalletHistory.save();
      }

      const remainingAmountForPartner = totalAmount;

      partner.walletBalance =
        (parseFloat(partner.walletBalance) || 0) + remainingAmountForPartner;

      const partnerWalletHistory = new walletHistory({
        partnerId: booking.partnerId,
        userId,
        bookingId: booking._id,
        transactionType: "Credit",
        genratedBookingId: booking.genratedBookingId,
        UiType: "Wallet",
        status: "Confirmed",
        isWithdrewble: false,
        amount: remainingAmountForPartner,
        bookingId: booking._id,
      });

      // await partnerWalletHistory.save();
      // await partner.save();

      return ""
    }

    const orderOptions = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `${genratedPaymentId}`,
      payment_capture: 1,
    };
  

    const order = await new Promise((resolve, reject) => {
      RazorpayInstance.orders.create(orderOptions, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

      checkBooking.paymentDetails.reciptNumber = genratedPaymentId;
      checkBooking.status = "unPaid";
   
      await checkBooking.save();
      console.log("Razorpay order created:", order);
      return order.id;
    
  } catch (error) {
    console.error(error);
    return "error in creating razor pay order"
  }
}

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
  
      const payment = await createPayment(bookingSummary?.booking?.summary?.userAmmount,bookingSummary?.booking._id,bookingSummary?.booking.genratedBookingId);
      const bookingId = bookingSummary?.booking._id;
      console.log(payment)
      res.status(201).json({ message: "success", bookingSummary ,payment,bookingId});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { orderId, paymentId, signature, bookingId } = req.body;
      console.log(req.body)
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
        pickUpDate,
        pickUpTime,
        returnDate,
        returnTime,
        longitude,
        latitude,
      } = req.query;
  
     
      if (!longitude || !latitude) {
        return res.status(400).json({ message: "Latitude and Longitude are required." });
      }
  
    
      const result = await CarBookingService.searchCar({
        pickUpDate,
        pickUpTime,
        returnDate,
        returnTime,
        latitude, longitude,
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
      const checkBooking = await CarBooking.findOne({ _id: bookingId });
      if (!checkBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      // Check if the amount is <= 0
      if (amount <= 0) {
        // Directly handle booking and payment logic
        const booking = await CarBooking.findById({ _id: bookingId });
        if (!booking) {
          throw new Error("Booking not found");
        }
        const partner = await Partner.findById(booking.partnerId);
        if (!partner) {
          throw new Error("Partner not found");
        }
        booking.status = "pending";
        booking.paymentDetails.isPaymentVerified = true;
        booking.paymentDetails.paymentId = genratedPaymentId; // Use the provided generated payment ID
        booking.paymentDetails.orderId = genratedPaymentId; // Use the same ID for consistency
        await booking.save();
        const totalAmount =
          booking.summary.subTotal -
          booking.summary.discount -
          booking.summary.commisionAmmount -
          booking.summary.totalTax;
        let userAmount = booking.summary.subTotal - booking.summary.discount;
        const userId = booking.userId;
        const userWalletBalanceDoc = await User.findById(userId);
        let walletBalance = parseFloat(
          userWalletBalanceDoc?.walletBalance || 0
        );
        const amountToDeduct = Math.min(walletBalance, userAmount);
        if (amountToDeduct > 0) {
          walletBalance -= amountToDeduct;
          userAmount -= amountToDeduct;
          await User.findByIdAndUpdate(userId, { walletBalance });
          const userWalletHistory = new WalletBalance({
            partnerId: booking.partnerId,
            userId,
            bookingId: booking._id,
            transactionType: "Debit",
            paymentId: booking.genratedBookingId,
            amount: amountToDeduct,
          });
          await userWalletHistory.save();
        }
        const remainingAmountForPartner = totalAmount;
        partner.walletBalance =
          (parseFloat(partner.walletBalance) || 0) + remainingAmountForPartner;
        const partnerWalletHistory = new walletHistory({
          partnerId: booking.partnerId,
          userId,
          bookingId: booking._id,
          transactionType: "Credit",
          genratedBookingId: booking.genratedBookingId,
          UiType: "Wallet",
          status: "Confirmed",
          isWithdrewble: false,
          amount: remainingAmountForPartner,
          bookingId: booking._id,
        });
        await partnerWalletHistory.save();
        await partner.save();
        return res.status(200).json({
          success: true,
          message: "Payment handled directly. Booking updated successfully.",
        });
      }
      const orderOptions = {
        amount: amount * 100,
        currency: "INR",
        receipt: genratedPaymentId,
        payment_capture: 1,
      };
      RazorpayInstance.orders.create(orderOptions, async (err, order) => {
        if (err) {
          console.error("Razorpay Error:", err);
          return res
            .status(500)
            .json({ error: "Error creating Razorpay order", details: err });
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
