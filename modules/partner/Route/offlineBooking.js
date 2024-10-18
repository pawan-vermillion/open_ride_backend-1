const { Router } = require('express')
const router = Router()

const {partnerAuthenication} = require('../middleware/partnerAuthenication');
const {OfflineBookingValidationRules , OfflineBookingvalidate} = require("../middleware/offlineBookingValidator")
const OfflineBookingController = require("../controller/offlineBookingController")

router.use(partnerAuthenication);


router.post("/booking" , OfflineBookingValidationRules() ,OfflineBookingvalidate , OfflineBookingController.createOfflineBooking)
router.get("/allBookings" ,OfflineBookingController.getAllOfflineBookings )


module.exports = router;    