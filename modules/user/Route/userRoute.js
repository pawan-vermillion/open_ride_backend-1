const express = require("express")
const router = express.Router();
const authRoute = require("../Route/auth");
const userProfileRoutes = require("./userProfileRoutes");

router.use("/auth" , authRoute);
router.use("/profile",userProfileRoutes);


module.exports = router;