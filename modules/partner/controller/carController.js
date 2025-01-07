const { validationResult } = require("express-validator");
const CarService = require("../services/shared/carService");
const AdminCarService = require("../../admin/services/shared/carService");
const {
  uploadToCloudinary,
  deleteOldImage,
} = require("../../shared/config/multer");
const cloudinary = require("../../shared/config/cloudinary");
const fs = require("fs");
const CarDetails = require("../model/car");
const Partner = require("../model/partner");

class CarController {
  createCar = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }

    req.body.type = "Partner";

    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(422)
        .json({ message: "At least one image file is required" });
    }

    try {
      const exteriorImages = req.files.exteriorImage || [];
      const interiorImages = req.files.interiorImage || [];
      const rcPhoto = req.files.rcPhoto ? req.files.rcPhoto[0] : null;

      const exteriorImageUrls =
        exteriorImages.length > 0
          ? exteriorImages.map((file) => file.path)
          : [];
      const interiorImageUrls =
        interiorImages.length > 0
          ? interiorImages.map((file) => file.path)
          : [];

      const rcPhotoUrl = rcPhoto ? rcPhoto.path : null;

      if (!rcPhotoUrl) {
        return res.status(422).json({ message: "rcPhoto is required." });
      }

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
        bodyStyle: req.body.bodyStyle,
        subModel: req.body.subModel,
        modelYear: req.body.modelYear,
      };

      const result = await CarService.createCarService(carData);

      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  // ========================== Old Code
  // createCar = async (req, res) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(422).json({ message: errors.array() });
  //   }

  //   req.body.type = "Partner";

  //   try {
  //     const partnerId = req.user.id; // Get the partner ID from the token
  //     const partner = await Partner.findById(partnerId);
  //     if (!partner) {
  //       return res.status(404).json({ message: "Partner not found" });
  //     }

  //     // Validate required fields
  //     const requiredFields = [
  //       'ownerFullName', 'numberOfSeat', 'numberOfDoors', 'fuelType',
  //       'transmission', 'carNumber', 'companyName', 'modelName',
  //       'rcNumber', 'rate', 'unit', 'address'
  //     ];

  //     for (const field of requiredFields) {
  //       if (!req.body[field]) {
  //         return res.status(422).json({ message: `${field} is required` });
  //       }
  //     }

  //     // Ensure rcPhoto exists before creating the car
  //     const rcPhoto = req.files['rcPhoto'] ? req.files['rcPhoto'][0].path : null;
  //     if (!rcPhoto) {
  //       return res.status(422).json({ message: "rcPhoto is required" });
  //     }

  //     // Create car data object
  //     const carData = {
  //       partnerId,
  //       ...req.body,
  //       rcPhoto, // Include the rcPhoto URL here
  //       rating: req.body.rating || 0,
  //       isCarVarified: req.body.isCarVarified || false,
  //     };

  //     // Create the car
  //     const result = await CarService.createCarService(carData);

  //     // Check for duplicate key error
  //     if (result instanceof Error && result.code === 11000) {
  //       return res.status(400).json({ message: "Car with this number already exists." });
  //     }

  //     return res.status(201).json({ message: 'Car successfully created', result });

  //   } catch (error) {
  //     console.error("Error in createCar:", error);
  //     return res.status(500).json({ message: "An error occurred while creating the car", error: error.message });
  //   }
  // }

  getAllCars = async (req, res) => {
    try {
      const partnerId = req.user.id;

      const { limit, page } = req.query;
      const cars = await AdminCarService.getAllCarsService({
        partnerId,
        page,
        limit,
      });
      return res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  getCarById = async (req, res) => {
    const carId = req.params.id;
    try {
      const car = await AdminCarService.getCarByIdService({ carId });
      return res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  updateCar = async (req, res) => {
    const carId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }

    try {
      const carData = {
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
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        rating: req.body.rating || 0,
        isCarVarified: req.body.isCarVarified || false,
        bodyStyle: req.body.bodyStyle,
        subModel: req.body.subModel,
        modelYear: req.body.modelYear,
      };

      // Call the service to update the car
      const updatedCar = await CarDetails.findByIdAndUpdate(carId, carData, {
        new: true,
      });

      return res.status(200).json(updatedCar);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  uploadCarImages = async (req, res) => {
    const carId = req.params.id;
    const partnerId = req.user.id;
    const {imageType} = req.body;
    

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }

    const validImageTypes = {
      exterior: "exteriorImage",
      interior: "interiorImage",
      rcBook: "rcPhoto",
      logo: "logoImage",
      driver: "driverImage",
    };

    if (!validImageTypes[imageType]) {
      return res.status(400).json({ message: "Invalid image type" });
    }

    try {
      const images = req.files ? req.files[validImageTypes[imageType]] : [];
      if (!images || images.length === 0) {
        return res
          .status(400)
          .json({ message: `No images provided for ${imageType}` });
      }

      if (imageType === "rcBook") {
        if (images.length > 1) {
          return res
            .status(400)
            .json({ message: "You can upload only 1 RC photo" });
        }

        const uploadedImageUrl = images[0].path;

        const updatedCar = await CarDetails.findOneAndUpdate(
          { _id: carId, partnerId },
          { $set: { rcPhoto: uploadedImageUrl } },
          { new: true }
        );

        if (!updatedCar) {
          return res
            .status(404)
            .json({ message: "Car not found or not owned by the partner" });
        }

        return res.status(200).json({
          message: "RC photo updated successfully",
          updatedCar,
        });
      }

      const uploadedImageUrls = images.map((file) => file.path);

      const carData = {};
      carData[`${imageType}Image`] = uploadedImageUrls;

      const updatedCar = await CarService.addCarImages(
        carId,
        partnerId,
        carData
      );

      return res.status(200).json(updatedCar);
    } catch (error) {
      console.error("Error uploading car images:", error);
      return res.status(500).json({ message: error.message });
    }
  };

  deleteCarImage = async (req, res) => {
    const { imageUrl } = req.query;
    const carId = req.params.id;
    const partnerId = req.user.id;
    const type = req.query.type;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    try {
      const parts = imageUrl.split("/");
      const publicId = parts.slice(7).join("/").split(".")[0];

  

      const car = await CarService.removeCarImageReference(
        carId,
        partnerId,
        type,
        imageUrl
      );
      const result = await deleteOldImage(publicId);

      if (result.result === "ok") {
        return res
          .status(200)
          .json({ message: "Image deleted successfully", result });
      } else {
        return res
          .status(404)
          .json({ message: "Image not found or already deleted", result });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      return res.status(500).json({ message: error.message });
    }
  };

  // //  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  OLD
  // updateCar = async (req, res) => {
  //   const carId = req.params.id;

  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(422).json({ message: errors.array()[0].msg });
  //   }

  //   try {
  //     const exteriorImages = req.files['exteriorImage'] ? (Array.isArray(req.files['exteriorImage']) ? req.files['exteriorImage'] : [req.files['exteriorImage']]) : [];
  //     const interiorImages = req.files['interiorImage'] ? (Array.isArray(req.files['interiorImage']) ? req.files['interiorImage'] : [req.files['interiorImage']]) : [];
  //     const rcPhoto = req.files['rcPhoto'] ? req.files['rcPhoto'][0] : null;

  //     const exteriorImageUrls = exteriorImages.map(file => file.path);
  //     const interiorImageUrls = interiorImages.map(file => file.path);
  //     const rcPhotoUrl = rcPhoto ? rcPhoto.path : '';

  //     // Prepare car data
  //     const carData = {
  //       exteriorImage: exteriorImageUrls.length ? exteriorImageUrls : undefined,
  //       interiorImage: interiorImageUrls.length ? interiorImageUrls : undefined,
  //       rcPhoto: rcPhotoUrl || undefined,
  //       ownerFullName: req.body.ownerFullName,
  //       numberOfSeat: req.body.numberOfSeat,
  //       numberOfDoors: req.body.numberOfDoors,
  //       fuelType: req.body.fuelType,
  //       transmission: req.body.transmission,
  //       ac: req.body.ac,
  //       sunRoof: req.body.sunRoof,
  //       carNumber: req.body.carNumber,
  //       companyName: req.body.companyName,
  //       modelName: req.body.modelName,
  //       rcNumber: req.body.rcNumber,
  //       rate: req.body.rate,
  //       unit: req.body.unit,
  //       description: req.body.description,
  //       address: req.body.address,
  //       latitude: req.body.latitude,
  //       longitude: req.body.longitude,
  //       rating: req.body.rating || 0,
  //       isCarVarified: req.body.isCarVarified || false,
  //       bodyStyle: req.body.bodyStyle,
  //       subModel: req.body.subModel,
  //       modelYear: req.body.modelYear
  //     };

  //     // Call the service to update the car
  //     const updatedCar = await CarService.uploadCarImages(carId, carData);

  //     return res.status(200).json(updatedCar);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };
}
module.exports = new CarController();
