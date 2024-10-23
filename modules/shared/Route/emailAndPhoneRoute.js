const { Router } = require("express");
const EmailAndPhoneController = require("../Controller/emailAndPhoneController");
const { EmailAndPhonevalidate, PhonevalidationRules, EmailvalidationRules, SendOtpEmailvalidationRules } = require("../Middleware/emailAndPhoneValidation");

const { sharedAuthentication } = require("../../shared/Middleware/validator/sharedAuthenication");

const router = Router();
router.use(sharedAuthentication);
router.patch("/phonenumber", PhonevalidationRules(), EmailAndPhonevalidate, EmailAndPhoneController.changePhoneNumber);
router.post("/email/sendotp", EmailAndPhoneController.sendOtpForEmail);
router.patch("/email", EmailvalidationRules(), EmailAndPhonevalidate, EmailAndPhoneController.changeEmailAddress);

module.exports = router;