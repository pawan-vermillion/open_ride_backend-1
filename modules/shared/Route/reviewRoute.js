const {Router} = require("express")
const{sharedAuthentication} = require("../Middleware/validator/sharedAuthenication")

const router = Router();

const GetReviewController = require("../Controller/reviewController")

router.use(sharedAuthentication)
router.get("/:carId" ,GetReviewController.getReviewsByCarId)



module.exports = router;