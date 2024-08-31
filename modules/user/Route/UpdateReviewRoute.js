const {Router} = require('express')
const router = Router();

const { userAuthenticate } = require("../middleware/userAuthenication");
const ReviewController = require("../controller/updateReviewController")
const {
    reviewValidationRules,
    validateReview,
  } = require("../middleware/reviewValidation");


router.use(userAuthenticate);
router.patch("/:carId" ,reviewValidationRules(),validateReview, ReviewController.addOrUpdateReview)


module.exports = router