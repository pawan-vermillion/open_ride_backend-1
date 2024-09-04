const { Router } = require('express')
const router = Router();

const authRoute = require("../shared/authRoute")
const adminProfileRoute = require("./adminProfilRoute")
const carRoutes = require("./carRoute")
const partnerRoute = require("./partnerRoute")
const userRoute = require("./userRoute")
const bankDetailsRoute = require("./bankDetailsRoute")
const bookingRoute = require("./bookingRoute")

router.use("/auth",authRoute)
router.use("/profile",adminProfileRoute)
router.use("/car" , carRoutes)
router.use("/partner" ,  partnerRoute)
router.use("/user" , userRoute)
router.use("/bankDetails",bankDetailsRoute)
router.use("/booking",bookingRoute)


module.exports = router;