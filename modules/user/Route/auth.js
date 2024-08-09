const {Router} = require('express')
const router = Router();

const {signupvalidationRule , signupvalidation} = require("../../shared/Middleware/validator/signupvaliadtion")

const UserAuthController = require("../controller/authenication");

router.post("/signup" , signupvalidationRule() , signupvalidation , UserAuthController.handleCreate);
router.post("/login" , UserAuthController.handleSignIn);


module.exports = router