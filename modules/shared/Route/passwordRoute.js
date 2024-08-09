const {Router} = require("express")
const{sharedAuthentication} = require("../Middleware/validator/sharedAuthenication")
const {PasswordvalidationRule ,ForgetpasswordValidate , ForgetPasswordValidationRule} = require("../Middleware/validator/passwordvalidator")
const router = Router();

const PasswordController = require("../Controller/passwordController");


router.patch("/change" ,sharedAuthentication ,PasswordvalidationRule(),ForgetpasswordValidate, PasswordController.changePassword  )

router.post("/forgot" , ForgetPasswordValidationRule() , ForgetpasswordValidate , PasswordController.forgotPassword )

module.exports = router;