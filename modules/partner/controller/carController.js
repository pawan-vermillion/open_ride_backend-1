const { validationResult } = require('express-validator');
const CarService = require("../services/shared/carService");
const AdminCarService = require("../../admin/services/shared/carService");
const { uploadToCloudinary } = require('../../shared/config/multer');

class CarController {
  createCar = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }

    req.body.type = "Partner";
    console.log(req.user.id);


    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(422).json({ message: "At least one image file is required" });
    }

    try {
      const exteriorImages = req.files['exteriorImage'] ? (Array.isArray(req.files['exteriorImage']) ? req.files['exteriorImage'] : [req.files['exteriorImage']]) : [];
      const interiorImages = req.files['interiorImage'] ? (Array.isArray(req.files['interiorImage']) ? req.files['interiorImage'] : [req.files['interiorImage']]) : [];
      console.log(interiorImages)
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



  getAllCars = async (req, res) => {
    try {
      const partnerId = req.user.id;

      const { limit, page } = req.query;
      const cars = await CarService.getAllCarsService({ partnerId, page, limit });
      return res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error);
    }
  }
  getCarById = async (req, res) => {
    const carId = req.params.id;
    try {
      const car = await AdminCarService.getCarByIdService({carId});
      return res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error);
    }
  }

  updateCar = async (req, res) => {
    const carId = req.params.Id;
   
    console.log("Update Body",req.body);
    
    const updateData = req.body;
    const files = req.files || {};
    const { exteriorImage, interiorImage, rcPhoto } = files;
    
    console.log(`Updating car with ID: ${carId}`);
    try {
      const existingCar = await CarService.getCarByIdService(carId);
  
      // Handle deletion of old images
      const deleteOldImages = async (urls) => {
        for (const url of urls) {
          const public_id = url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(public_id);
        }
      };
  
      // Upload new images and update the data
      if (exteriorImage) {
        await deleteOldImages(existingCar.exteriorImage.split(','));
        const exteriorImageUrls = await Promise.all(exteriorImage.map(file => uploadToCloudinary(file.path, 'uploads/partner/car/exterior')));
        updateData.exteriorImage = exteriorImageUrls.join(',');
      }
  
      if (interiorImage) {
        await deleteOldImages(existingCar.interiorImage.split(','));
        const interiorImageUrls = await Promise.all(interiorImage.map(file => uploadToCloudinary(file.path, 'uploads/partner/car/interior')));
        updateData.interiorImage = interiorImageUrls.join(',');
      }
  
      if (rcPhoto) {
        if (existingCar.rcPhoto) {
          const oldRcPhotoId = existingCar.rcPhoto.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(oldRcPhotoId);
        }
        const rcPhotoUrl = await uploadToCloudinary(rcPhoto[0].path, 'uploads/partner/car/rcBook');
        updateData.rcPhoto = rcPhotoUrl;
      }
  
      // Update car details
      const result = await CarService.updateCarService(carId, updateData);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Update car error:', error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  

}

module.exports = new CarController();
