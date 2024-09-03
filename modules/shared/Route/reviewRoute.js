const {Router} = require("express")
const router = Router();
const{sharedAuthentication} = require("../Middleware/validator/sharedAuthenication")
const {userAuthenticate} = require("../../user/middleware/userAuthenication");
const GetReviewController = require("../Controller/reviewController");
const {partnerAuthenication} = require("../../partner/middleware/partnerAuthenication");
const PartnerReviewController = require("../../partner/controller/partnerReviewController")
const UserReviewController = require("../../user/controller/updateReviewController")
const {reviewValidationRules , validateReview} = require("../../user/middleware/reviewValidation")

router.patch("/user/:carId",userAuthenticate ,reviewValidationRules(),validateReview, UserReviewController.addOrUpdateReview);
router.patch("/partner/:userId",partnerAuthenication ,reviewValidationRules(),validateReview, PartnerReviewController.upadteReview);
router.get("/car/:carId",sharedAuthentication ,GetReviewController.getReviewsByCarId)
router.get("/user/:userId",sharedAuthentication,GetReviewController.getReviewsByUserId)



module.exports = router;