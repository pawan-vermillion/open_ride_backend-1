const express = require('express')
const router = express.Router();

const authRoute = require("./authRoute");
const partnerProfileRoute = require("./partnerProfileRoute")
const carRoute = require("./carRoute")
const wallet = require("./wallletBalance")

router.use("/auth",authRoute);
router.use("/profile" ,partnerProfileRoute);
router.use("/car" , carRoute)
router.use("/wallet" , wallet)


module.exports = router;