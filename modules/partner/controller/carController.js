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

        if (!req.files || req.files.length === 0) {
            return res.status(422).json({ message: "At least one image file is required" });
        }

        try {
            const exteriorImages = req.files['exteriorImage'] || [];
            const interiorImages = req.files['interiorImage'] || [];
            const rcPhoto = req.files['rcPhoto'] ? req.files['rcPhoto'][0] : null;
        
            const uploadPromises = [
                ...exteriorImages.map(file => uploadToCloudinary(req, file.path, file.fieldname)),
                ...interiorImages.map(file => uploadToCloudinary(req, file.path, file.fieldname))
            ];
        
            if (rcPhoto) {
                uploadPromises.push(uploadToCloudinary(req, rcPhoto.path, rcPhoto.fieldname));
            }
        
            const uploadedImages = await Promise.all(uploadPromises);
        
            const carData = {
                ...req.body,
                partnerId: req.user.id,
                exteriorImage: uploadedImages.slice(0, exteriorImages.length).join(',') || undefined,
                interiorImage: uploadedImages.slice(exteriorImages.length, exteriorImages.length + interiorImages.length).join(',') || undefined,
                rcPhoto: rcPhoto ? uploadedImages[uploadedImages.length - 1] : undefined,
            };
        
            const result = await CarService.createCarService(carData);
            return res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.log(error);
        }
    }
}

module.exports = new CarController();