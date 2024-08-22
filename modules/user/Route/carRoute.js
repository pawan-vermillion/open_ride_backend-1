const {Router} = require('express')
const router = Router();

const {summaryValidationRules , validate} = require("../middleware/carBookingSummaryValiodation")
const CarBookingController = require("../controller/carBookingController");

const {userAuthenticate} = require("../middleware/userAuthenication")

router.use(userAuthenticate);
router.get("/availability/:carId", CarBookingController.checkAvailability);
router.post("/bookingsummary/:carId",summaryValidationRules(),validate,CarBookingController.getBookingController)

router.post("/paymentVerify", CarBookingController.verifyPayment)

module.exports = router