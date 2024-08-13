const express = require("express")
const router = express.Router();
const authRoute = require("../Route/auth");
const userProfileRoutes = require("./userProfileRoutes");
const favoriteCarRoute = require("../Route/favoriteCarRoutes")

router.use("/auth" , authRoute);
router.use("/profile",userProfileRoutes);
router.use("/favorite",favoriteCarRoute)


module.exports = router;