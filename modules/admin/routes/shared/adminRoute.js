const { Router } = require('express')
const router = Router();

const authRoute = require("../shared/authRoute")
const adminProfileRoute = require("./adminProfilRoute")

router.use("/auth",authRoute)
router.use("/profile",adminProfileRoute)

module.exports = router;