const AdminCarService = require("../../services/shared/carService");
const CarService = require("../../../partner/services/shared/carService")
const { validationResult } = require('express-validator');
const { uploadToCloudinary } = require('../../../shared/config/multer');

class AdminCarController {

  
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
        partnerId: req.params.partnerId,
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
    

      const {search , limit, page } = req.query;
      const cars = await AdminCarService.getAllCarsService({search ,   page, limit });
      
      return res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ message: error.message });
      
    }
  }
  getCarById = async (req, res) => {
    const carId = req.params.id;
    try {
      const car = (await AdminCarService.getCarByIdService({carId}))
      return res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message });
    
    }
  }
}

module.exports = new AdminCarController();
