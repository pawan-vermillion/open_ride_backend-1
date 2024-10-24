const CarDetails = require("../../model/car");
const { uploadToCloudinary, deleteOldImage, cloudinary } = require('../../../shared/config/multer');

class CarService {
  async createCarService(CarData, files) {
    try {
     
      const newCarAdd = new CarDetails(CarData);
      const savedCar = await newCarAdd.save();
  
  
      
      if (files) {
     const uploadedImages = await this.uploadCarImages(savedCar._id, files); // Call the method to upload images
  
   
        savedCar.exteriorImage = uploadedImages.exteriorImage || [];
        savedCar.interiorImage = uploadedImages.interiorImage || [];
        savedCar.rcPhoto = uploadedImages.rcPhoto || '';
  
    
        await savedCar.save();
  
     
      }
  
      return { status: 201, message: "New Car added successfully" };
    } catch (error) {
      
      throw new Error("Error occurred while creating a new Car: " + error.message);
    }
  }
    

  async getAllCarsService({ page, limit }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
      const totalCars = await CarDetails.countDocuments();
      const cars = await CarDetails.find().skip(skip).limit(pageSize);
      return {
        page: currentPage,
        limit: pageSize,
        totalCars: totalCars,
        cars: cars,
      };
    } catch (error) {
      throw new Error("Error occurred while fetching car data.");
    }
  }

  
  async uploadCarImages(carId, files) {
    try {

      const existingCar = await CarDetails.findById(carId);

      if (!existingCar) throw new Error("Car not found");

      const existingExteriorImages = existingCar.exteriorImage || [];
      const existingInteriorImages = existingCar.interiorImage || [];
      const existingRcPhoto = existingCar.rcPhoto || '';

      const newExteriorImages = carData.exteriorImage || [];
      const newInteriorImages = carData.interiorImage || [];
      const newRcPhoto = carData.rcPhoto || '';


      const deleteImages = async (oldImages, newImages) => {
        const imagesToDelete = oldImages.filter(image => !newImages.includes(image));
        for (const imageUrl of imagesToDelete) {
          await cloudinary.uploader.destroy(imageUrl); // Remove from Cloudinary
        }
      };

      await deleteImages(existingExteriorImages, newExteriorImages);
      await deleteImages(existingInteriorImages, newInteriorImages);

      if (existingRcPhoto && existingRcPhoto !== newRcPhoto) {
        await cloudinary.uploader.destroy(existingRcPhoto);
      }

      // Update the car details in the database with new image URLs and other data
      const updatedCar = await CarDetails.findByIdAndUpdate(carId, carData, { new: true });
      return updatedCar;

    } catch (error) {
      console.error("Error uploading files:", error.message);
      throw new Error("File upload failed: " + error.message);
    }
  }




}

module.exports = new CarService();



