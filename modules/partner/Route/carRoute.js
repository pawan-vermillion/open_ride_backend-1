const { Router } = require('express')
const router = Router()
const CarController = require("../controller/carController")
const { partnerAuthenication } = require("../middleware/partnerAuthenication")
const { uploadMultiple } = require("../../shared/config/multer");
const {CarValidationRules , carValidation}=require("../middleware/carValidator")

router.use(partnerAuthenication)

router.post('/addCar',uploadMultiple,
    CarValidationRules(),       // Validate car data
    carValidation,              // Check validation results
    CarController.createCar     // Final controller action
  );

module.exports = router;