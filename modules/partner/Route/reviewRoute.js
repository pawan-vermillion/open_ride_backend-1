const { Router } = require('express')
const router = Router()

const ReviewController = require("../controller/partnerReviewController")
const {partnerAuthenication} = require('../middleware/partnerAuthenication');
const {reviewValidationRules , validateReview} = require("../../user/middleware/reviewValidation")

router.use(partnerAuthenication);
router.patch("/:userId" ,reviewValidationRules(), validateReview , ReviewController.upadteReview)

module.exports = router;