const CarDetails = require("../../model/car")
const { uploadToCloudinary , cloudinary } = require('../../../shared/config/multer');
const { deleteOldImages } = require('../../../shared/config/cloudinary');

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

 
   deleteOldImages = async (urls) => {
    if (!urls) return;
    const urlsArray = Array.isArray(urls) ? urls : [urls];
    for (const url of urlsArray) {
      const public_id = getPublicIdFromUrl(url);
      if (public_id) {
        try {
          await cloudinary.uploader.destroy(public_id);
        } catch (error) {
          console.error(`Error deleting old image ${public_id}:`, error);
        }
      }
    }
  };
  
   uploadImages = async (images, folder) => {
    if (!images || images.length === 0) return [];
    try {
      const uploadPromises = images.map(file => uploadToCloudinary(file.path, folder));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Error uploading images to Cloudinary');
    }
  };
  
   updateCarService = async (carId, updateData, files) => {
    try {
      const existingCar = await CarDetails.findById(carId);
      if (!existingCar) {
        throw new Error("Car not found.");
      }
  
      const { exteriorImage, interiorImage, rcPhoto } = files;
  
      if (exteriorImage && exteriorImage.length > 0) {
        await deleteOldImages(existingCar.exteriorImage);
        updateData.exteriorImage = await uploadImages(exteriorImage, 'uploads/partner/car/exterior');
      } else {
        updateData.exteriorImage = existingCar.exteriorImage;
      }
  
      if (interiorImage && interiorImage.length > 0) {
        await deleteOldImages(existingCar.interiorImage);
        updateData.interiorImage = await uploadImages(interiorImage, 'uploads/partner/car/interior');
      } else {
        updateData.interiorImage = existingCar.interiorImage;
      }
  
      if (rcPhoto && rcPhoto.length > 0) {
        await deleteOldImages(existingCar.rcPhoto);
        updateData.rcPhoto = await uploadToCloudinary(rcPhoto[0].path, 'uploads/partner/car/rcBook');
      } else {
        updateData.rcPhoto = existingCar.rcPhoto;
      }
  
      const updatedCar = await CarDetails.findByIdAndUpdate(carId, updateData, { new: true });
      if (!updatedCar) {
        throw new Error("Failed to update car.");
      }
  
      return updatedCar;
  
    } catch (error) {
      console.error(`Error occurred while updating car data: ${error.message}`);
      throw new Error(`Error occurred while updating car data: ${error.message}`);
    }
  };
  
  
  

}

module.exports = new CarService()