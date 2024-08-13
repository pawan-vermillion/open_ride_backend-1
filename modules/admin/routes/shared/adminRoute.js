const { Router } = require('express')
const router = Router();

const authRoute = require("../shared/authRoute")
const adminProfileRoute = require("./adminProfilRoute")
const carRoutes = require("./carCompanyRoute")

router.use("/auth",authRoute)
router.use("/profile",adminProfileRoute)
router.use("/car" , carRoutes)

module.exports = router;