const express = require('express');
const router = express.Router();
const CarController = require('../controller/carController');
const {partnerAuthenication } = require('../middleware/partnerAuthenication');
const { uploadMultiple ,uploadToCloudinary, convertBufferToFile, convertBufferToFiles} = require('../../shared/config/multer');
const { CarValidationRules, carValidation } = require('../middleware/carValidator');

router.use(partnerAuthenication);

router.post("/api/car",
    CarValidationRules(),
    (req,res)=>{console.log(req.body)},
    carValidation,       
    uploadMultiple,       
    (req, res) => {
        
        const carData = req.body;
        const files = req.files;

       
        res.status(200).json({
            message: "Car details and images uploaded successfully",
            carData,
            files
        });
    }
);
// Define routes for car operations
router.post('/addCar',uploadMultiple,convertBufferToFiles ,  CarValidationRules(), carValidation, CarController.createCar);
router.get('/allCars', CarController.getAllCars);
router.get('/carId/:id', CarController.getCarById);
router.patch('/updateCar/:id', CarController.updateCar);
router.patch('/updateCarImages/:id', uploadMultiple, CarController.uploadCarImages);
router.delete('/deleteCarImages/:id', CarController.deleteCarImage);
router.delete('/deleteCar/:id', CarController.deleteCar);

module.exports = router;