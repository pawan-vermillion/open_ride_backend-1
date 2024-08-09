const express = require('express')
const router = express.Router();

const authRoute = require("../route/authRoute");
const partnerProfileRoute = require("./partnerProfileRoute")

router.use("/auth",authRoute);
router.use("/profile" ,partnerProfileRoute);

module.exports = router;