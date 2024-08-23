const express = require('express')
const router = express.Router();

const authRoute = require("./authRoute");
const partnerProfileRoute = require("./partnerProfileRoute")
const carRoute = require("./carRoute")

router.use("/auth",authRoute);
router.use("/profile" ,partnerProfileRoute);
router.use("/car" , carRoute)


module.exports = router;