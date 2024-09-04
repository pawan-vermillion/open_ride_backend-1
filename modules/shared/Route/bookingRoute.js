const express = require('express')
const router = express.Router();

const BookingController = require("../Controller/bookingController")
const { cancelBookingValidator, bookingValidate } = require("../Middleware/validator/bookingValidator")
const { sharedAuthentication } = require("../Middleware/validator/sharedAuthenication")


router.use(sharedAuthentication)
router.post('/cancle/:bookingId',
  cancelBookingValidator(), bookingValidate, BookingController.cancelBooking
);
router.get("/:status", BookingController.getBookingController);



module.exports = router;


