const { validationResult } = require('express-validator');
const CarService = require("../services/shared/carService");
const { uploadToCloudinary } = require('../../shared/config/multer');

class CarController {
    createCar = async (req, res) => {        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.array()[0].msg });
        }
    
        req.body.type = "Partner";
    
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(422).json({ message: "At least one image file is required" });
        }
    
        try {
            const exteriorImages = Array.isArray(req.files['exteriorImage']) ? req.files['exteriorImage'] : [req.files['exteriorImage']];
            const interiorImages = Array.isArray(req.files['interiorImage']) ? req.files['interiorImage'] : [req.files['interiorImage']];
            const rcPhoto = req.files['rcPhoto'] ? req.files['rcPhoto'][0] : null;
    
            // Collect URLs from the uploaded files
            const exteriorImageUrls = exteriorImages.map(file => file.path);
            const interiorImageUrls = interiorImages.map(file => file.path);
            const rcPhotoUrl = rcPhoto ? rcPhoto.path : '';

            const carData = {
                partnerId: req.user.id,
                ownerFullName: req.body.ownerFullName,
                numberOfSeat: req.body.numberOfSeat,
                numberOfDoors: req.body.numberOfDoors,
                fuelType: req.body.fuelType,
                transmission: req.body.transmission,
                ac: req.body.ac,
                sunRoof: req.body.sunRoof,
                carNumber: req.body.carNumber,
                companyName: req.body.companyName,
                modelName: req.body.modelName,
                rcNumber: req.body.rcNumber,
                rate: req.body.rate,
                unit: req.body.unit,
                description: req.body.description,
                exteriorImage: exteriorImageUrls.join(','),
                interiorImage: interiorImageUrls.join(','),
                rcPhoto: rcPhotoUrl,
                address: req.body.address,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                rating: req.body.rating || 0,
                isCarVarified: req.body.isCarVarified || false
            };
    
            const result = await CarService.createCarService(carData);
            return res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }
}

    

module.exports = new CarController();
