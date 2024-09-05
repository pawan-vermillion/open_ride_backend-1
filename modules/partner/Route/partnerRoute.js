const express = require('express')
const router = express.Router();

const authRoute = require("./authRoute");
const partnerProfileRoute = require("./partnerProfileRoute")
const carRoute = require("./carRoute")
const wallet = require("./wallletBalance")
const bankingDetailsRoute = require("./bankDetails")
const earningRoute = require("./earningRoute")


router.use("/auth",authRoute);
router.use("/profile" ,partnerProfileRoute);
router.use("/car" , carRoute)
router.use("/wallet" , wallet)
router.use("/bankDetails" , bankingDetailsRoute)
router.use("/earning",earningRoute)



module.exports = router;