const express = require('express');
const router = express.Router();

const {sharedAuthentication} = require("../Middleware/validator/sharedAuthenication");




router.use(sharedAuthentication)

router.post("/cancleBooking" ,)
module.exports = router;