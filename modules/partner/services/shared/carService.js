const CarDetails = require("../../model/car")
const { uploadToCloudinary , cloudinary } = require('../../../shared/config/multer');



class CarService {
  async createCarService(CarData) {
    try {
      const newCarAdd = new CarDetails(CarData);
      await newCarAdd.save();

      return { message: "New Car add successflluy" };
    } catch (error) {
      
      throw new Error("Error occurred while creating a new Car.", error.message);
    }
  }

 
  async getAllCarsService({ page, limit }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
      const totalCars = await CarDetails.countDocuments()
      const cars = await CarDetails.find().skip(skip).limit(pageSize)
      return {
        page:currentPage,
        limit:pageSize,
        totalCars:totalCars,
        cars:cars
      }
    } catch (error) {
   
      throw new Error("Error occurred while fetching car data.");
    }
  }
  async updateCarService(carId, carData) {
    try {
      // Fetch the car to get existing image URLs
      const existingCar = await CarDetails.findById(carId);
      if (!existingCar) throw new Error("Car not found");
  
      // Extract existing images from the database
      const existingExteriorImages = existingCar.exteriorImage || [];
      const existingInteriorImages = existingCar.interiorImage || [];
      const existingRcPhoto = existingCar.rcPhoto || '';
  
      // Extract new images from the request (user-provided data)
      const newExteriorImages = carData.exteriorImage || [];
      const newInteriorImages = carData.interiorImage || [];
      const newRcPhoto = carData.rcPhoto || '';
  
      // Function to delete images that are no longer present in the update request
      const deleteImages = async (oldImages, newImages) => {
        const imagesToDelete = oldImages.filter(image => !newImages.includes(image));
        for (const imageUrl of imagesToDelete) {
          await cloudinary.uploader.destroy(imageUrl); // Remove from Cloudinary
        }
      };
  
      // Check and delete any removed exterior and interior images from Cloudinary
      await deleteImages(existingExteriorImages, newExteriorImages);
      await deleteImages(existingInteriorImages, newInteriorImages);
  
      // If rcPhoto is changed, delete the old one
      if (existingRcPhoto && existingRcPhoto !== newRcPhoto) {
        await cloudinary.uploader.destroy(existingRcPhoto);
      }
  
      // Update the car details in the database with new image URLs and other data
      const updatedCar = await CarDetails.findByIdAndUpdate(carId, carData, { new: true });
      return updatedCar;
  
    } catch (error) {
      throw new Error("Error occurred while updating car data: " + error.message);
    }
  }
  

 

  
}

  

  
  
  
  


  
  



module.exports = new CarService()