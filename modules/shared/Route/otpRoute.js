const { Router } = require("express");
const {
  phoneValidationRules,
  phoneValidate,
} = require("../../shared/Middleware/validator/phonevalidation");
const OtpContoller = require("../Controller/otpContoller");

const router = Router();


router.post(
  "/sendotp",
  phoneValidationRules(),
  phoneValidate,
  OtpContoller.sendOtp

);


// = = = = = = = = = = =  = =  = = = = = 
// router.post(
//   "/sendotp",
//   phoneValidationRules(),
//   phoneValidate,

//   async (req, res) => {
//     try {
//       const { emailAddress, phoneNumber } = req.body;
//       const result = await sendOTP(emailAddress, phoneNumber);
//       res.status(200).json(result);
//     }
//     catch (error) {

//       res.status(500).json({ message: "Failed to send OTP" });
//     }
//   }
// );

module.exports = router;