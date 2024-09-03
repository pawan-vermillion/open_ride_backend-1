const {Router} = require('express')
const router = Router();

const { userAuthenticate } = require("../middleware/userAuthenication");
const CarVerificationController = require("../controller/verificationStatusController");
const CarFilterController = require("../controller/carFilterController")
const {carFilterValidationRules , validateCarFilter} = require("../middleware/carFilterValidation")

router.use(userAuthenticate);
router.get("/allCars",CarVerificationController.getVerifiedCars );
router.get("/:id" ,CarVerificationController.getCarById)
router.post("/filter",carFilterValidationRules(),validateCarFilter,CarFilterController.addCarFilter)

module.exports = router