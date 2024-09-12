const { validationResult } = require('express-validator');
const CarService = require("../services/shared/carService");
const AdminCarService = require("../../admin/services/shared/carService");
const { uploadToCloudinary , cloudinary } = require('../../shared/config/multer');
const fs = require('fs');
const CarDetails = require("../model/car")

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
      const exteriorImages = req.files['exteriorImage'] ? (Array.isArray(req.files['exteriorImage']) ? req.files['exteriorImage'] : [req.files['exteriorImage']]) : [];
      const interiorImages = req.files['interiorImage'] ? (Array.isArray(req.files['interiorImage']) ? req.files['interiorImage'] : [req.files['interiorImage']]) : [];
     
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
        exteriorImage: exteriorImageUrls,
        interiorImage: interiorImageUrls,
        rcPhoto: rcPhotoUrl,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        rating: req.body.rating || 0,
        isCarVarified: req.body.isCarVarified || false,
        bodyStyle:req.body.bodyStyle,
        subModel:req.body.subModel,
        modelYear:req.body.modelYear
      };

      const result = await CarService.createCarService(carData);
     
      return res.status(201).json(result);
     
    } catch (error) {
     
      res.status(500).json({ message: error.message });
      
    }
  }



  getAllCars = async (req, res) => {
    try {
      const partnerId = req.user.id;

      const { limit, page } = req.query;
      const cars = await AdminCarService.getAllCarsService({ partnerId, page, limit });
      return res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ message: error.message });
      
    }
  }
  getCarById = async (req, res) => {
    const carId = req.params.id;
    try {
      const car = await AdminCarService.getCarByIdService({carId});
      return res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message });
    
    }
  }
  updateCar = async (req, res) => {
    const carId = req.params.id;
    const updateData = req.body;
    const files = req.files || {};
    const { exteriorImage, interiorImage, rcPhoto } = files;
  
    try {
      const existingCar = await CarDetails.findById(carId);
      if (!existingCar) {
        return res.status(404).json({ message: "Car not found." });
      }
  
      let newExteriorImageUrls = [];
      let newInteriorImageUrls = [];
      let newRcPhotoUrl = '';
  
      const deleteOldImages = async (urls) => {
        if (!urls) return;
        const urlsArray = Array.isArray(urls) ? urls : [urls];
  
        for (const url of urlsArray) {
          if (url) {
            const public_id = url.split('/').pop().split('.')[0];
            try {
              await cloudinary.uploader.destroy(public_id);
            } catch (error) {
              console.error(`Error deleting old image ${public_id}:`, error);
            }
          }
        }
      };
  
      const uploadImages = async (images, folder) => {
        if (!images || images.length === 0) return [];
  
        const uploadPromises = images.map(file => uploadToCloudinary(req, file.path, folder));
        return await Promise.all(uploadPromises);
      };
  
      if (exteriorImage && exteriorImage.length > 0) {
        await deleteOldImages(existingCar.exteriorImage);
        newExteriorImageUrls = await uploadImages(exteriorImage, 'uploads/partner/car/exterior');
        updateData.exteriorImage = newExteriorImageUrls;
      } else {
        updateData.exteriorImage = existingCar.exteriorImage;
      }
  
      if (interiorImage && interiorImage.length > 0) {
        await deleteOldImages(existingCar.interiorImage);
        newInteriorImageUrls = await uploadImages(interiorImage, 'uploads/partner/car/interior');
        updateData.interiorImage = newInteriorImageUrls;
      } else {
        updateData.interiorImage = existingCar.interiorImage;
      }
  
      if (rcPhoto && rcPhoto.length > 0) {
        await deleteOldImages(existingCar.rcPhoto);
        newRcPhotoUrl = await uploadToCloudinary(req, rcPhoto[0].path, 'uploads/partner/car/rcBook');
        updateData.rcPhoto = newRcPhotoUrl;
      } else {
        updateData.rcPhoto = existingCar.rcPhoto;
      }
  
      const result = await CarService.updateCarService(carId, updateData);
  
      const cleanupFiles = (files) => {
        if (files && Array.isArray(files)) {
          files.forEach(file => {
            if (file.path && file.path.startsWith("D:")) {
              fs.unlink(file.path, (err) => {
                if (err) {
                  console.error(`Error deleting temporary file: ${file.path}`, err);
                }
              });
            }
          });
        }
      };
  
      cleanupFiles(exteriorImage);
      cleanupFiles(interiorImage);
      cleanupFiles(rcPhoto);
  
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateCar:', error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  


}
  
  
  
  
  



module.exports = new CarController();
