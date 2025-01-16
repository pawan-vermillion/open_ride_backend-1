const express = require('express');
const router = express.Router();
const CarController = require('../controller/carController');
const {partnerAuthenication } = require('../middleware/partnerAuthenication');
const { uploadMultiple ,uploadToCloudinary, convertBufferToFile, convertBufferToFiles} = require('../../shared/config/multer');
const { CarValidationRules, carValidation } = require('../middleware/carValidator');
const { sharedAuthentication } = require('../../shared/Middleware/validator/sharedAuthenication');



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
router.post('/addCar',partnerAuthenication,uploadMultiple,convertBufferToFiles ,  CarValidationRules(), carValidation, CarController.createCar);
router.get('/allCars', partnerAuthenication,CarController.getAllCars);
router.get('/myCar',partnerAuthenication, CarController.getPartnerCar);
router.get('/carId/:id', sharedAuthentication,CarController.getCarById);
router.patch('/updateCar/:id',partnerAuthenication, CarController.updateCar);
router.patch('/updateCarImages/:id',partnerAuthenication, uploadMultiple, CarController.uploadCarImages);
router.delete('/deleteCarImages/:id',partnerAuthenication, CarController.deleteCarImage);
router.delete('/deleteCar/:id',partnerAuthenication, CarController.deleteCar);

module.exports = router;