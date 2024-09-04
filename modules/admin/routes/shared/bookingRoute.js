const {Router} = require('express')
const router = Router();




const {adminAuthenticate} = require("../../middleware/adminAuthenication")
const CheckStatusBookingController = require("../../controller/shared/checkStatusBookingController")

router.use(adminAuthenticate);


router.get("/partner/:status/:partnerId", CheckStatusBookingController.PartnerCheckStausBooking  )
router.get("/user/:status/:userId", CheckStatusBookingController.UserCheckStausBooking  )


module.exports = router