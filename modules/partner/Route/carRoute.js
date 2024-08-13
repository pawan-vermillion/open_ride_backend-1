const { Router } = require('express')
const router = Router()
const CarController = require("../controller/carController")
const { partnerAuthenication } = require("../middleware/partnerAuthenication")
const { upload } = require("../../shared/config/multer");
const {CarValidationRules , carValidation}=require("../middleware/carValidator")

router.use(partnerAuthenication)

router.post('/addCar',
  upload.fields([
    { name: 'exteriorImage', maxCount: 2 },
    { name: 'interiorImage', maxCount: 4 },
    { name: 'rcPhoto', maxCount: 1 }
]),
    CarValidationRules(),       // Validate car data
    carValidation,              // Check validation results
    CarController.createCar     // Final controller action
  );

module.exports = router;