const {Router} = require("express")
const router = Router()


const {
    signupvalidationRule,
    signupvalidation,
} = require("../../shared/Middleware/validator/signupvaliadtion");
const PartnerController = require('../controller/authenication');

router.post(
    "/signup",
    signupvalidationRule(),
    signupvalidation,
    PartnerController.handleCreatePartner
  );

router.post("/login",PartnerController.handleSignIn);

module.exports = router