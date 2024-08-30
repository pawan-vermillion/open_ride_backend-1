const {Router} = require('express')
const router = Router();

const { userAuthenticate } = require("../middleware/userAuthenication");
const CarVerificationController = require("../controller/verificationStatusController")

router.use(userAuthenticate);
router.get("/allCars",CarVerificationController.getVerifiedCars );
router.get("/:id" ,CarVerificationController.getCarById)


module.exports = router