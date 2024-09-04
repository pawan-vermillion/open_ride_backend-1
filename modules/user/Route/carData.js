const {Router} = require('express')
const router = Router();

const { userAuthenticate } = require("../middleware/userAuthenication");
const CarVerificationController = require("../controller/verificationStatusController");
const CarFilterController = require("../controller/carFilterController")
const {carFilterValidationRules , validateCarFilter} = require("../middleware/carFilterValidation")
const AdminCarController = require("../../admin/controller/shared/carController")

router.use(userAuthenticate);
router.get("/verifiedCars",CarVerificationController.getVerifiedCars );
router.get("/:id" ,CarVerificationController.getCarById)
router.post("/filter",carFilterValidationRules(),validateCarFilter,CarFilterController.addCarFilter)
router.get("/allCars", AdminCarController.getAllCars);

module.exports = router