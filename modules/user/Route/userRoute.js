const express = require("express")
const router = express.Router();
const authRoute = require("../Route/auth");
const userProfileRoutes = require("./userProfileRoutes");
const favoriteCarRoute = require("../Route/favoriteCarRoutes")
const carRoute = require("../Route/carRoute")
const walletRoute = require("../Route/walletRoute")

router.use("/auth" , authRoute);
router.use("/profile",userProfileRoutes);
router.use("/favorite",favoriteCarRoute);
router.use("/booking" , carRoute);
router.use("/wallet" ,walletRoute )


module.exports = router;