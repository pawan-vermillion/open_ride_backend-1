const express = require('express')
const router = express.Router();

const authRoute = require("./authRoute");
const partnerProfileRoute = require("./partnerProfileRoute")
const carRoute = require("./carRoute")
const wallet = require("./wallletBalance")
const reviewRoute = require("./reviewRoute")
const bankingDetailsRoute = require("./bankDetails")

router.use("/auth",authRoute);
router.use("/profile" ,partnerProfileRoute);
router.use("/car" , carRoute)
router.use("/wallet" , wallet)
router.use("/review" , reviewRoute)
router.use("/bankDetails" , bankingDetailsRoute)


module.exports = router;