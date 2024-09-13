const { Router } = require('express')
const router = Router()
const CarController = require("../controller/carController")
const {partnerAuthenication} = require('../middleware/partnerAuthenication');
const { uploadMultiple } = require("../../shared/config/multer");
const {CarValidationRules , carValidation}=require("../middleware/carValidator");



router.use(partnerAuthenication);
router.post('/addCar',uploadMultiple,
    CarValidationRules(),       
    carValidation,             
    CarController.createCar    
  );

  router.get('/allCars', CarController.getAllCars);
  router.get('/carId/:id', CarController.getCarById);
  router.patch('/updateCar/:id', 
    uploadMultiple,          
    CarValidationRules(),    
    carValidation,           
    CarController.updateCar
  );
 

module.exports = router;