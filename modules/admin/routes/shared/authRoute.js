const { Router } = require('express')
const router = Router();
const {
    signupvalidationRule,
    signupvalidation,
} = require("../../../shared/Middleware/validator/signupvaliadtion");
const AuthController = require('../../controller/shared/authenication');


router.post(
    "/signup",
    signupvalidationRule(),
    signupvalidation,
    AuthController.handleCreateAdmin,
  );

router.post("/login", AuthController.handleSignIn);

module.exports = router;