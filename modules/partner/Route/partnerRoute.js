const express = require('express')
const router = express.Router();

const authRoute = require("./authRoute");
const partnerProfileRoute = require("./partnerProfileRoute")
const carRouter = require("./carRouter")
const wallet = require("./wallletBalance")
const bankingDetailsRoute = require("./bankDetails")
const earningRoute = require("./earningRoute")
const offlineBookingRoute = require("./offlineBooking")
const driverRouter = require("../Route/driverRouter")
const repairCarRoute = require("./repairCarRoute")

router.use("/auth",authRoute);
router.use("/profile" ,partnerProfileRoute);
router.use("/car" , carRouter)
router.use("/wallet" , wallet)
router.use("/bankDetails" , bankingDetailsRoute)
router.use("/earning",earningRoute)
router.use("/ofline",offlineBookingRoute)
router.use("/driver" , driverRouter)
router.use("/repairCar",repairCarRoute)

module.exports = router;