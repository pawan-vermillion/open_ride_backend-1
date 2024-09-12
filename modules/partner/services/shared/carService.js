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

  async updateCarService(carId, updateData, files) {
    try {
      // Find existing car details
      const existingCar = await CarDetails.findById(carId);
      if (!existingCar) {
        throw new Error("Car not found.");
      }
  
      // Utility function to extract public ID from a Cloudinary URL
      const getPublicIdFromUrl = (url) => {
        if (!url) return null;
        const parts = url.split('/');
        const fileName = parts.pop();
        return fileName.split('.')[0];
      };
  
      // Utility function to delete old images from Cloudinary
      const deleteOldImages = async (urls) => {
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
  
      // Utility function to upload images to Cloudinary
      const uploadImages = async (images, folder) => {
        if (!images || images.length === 0) return [];
        try {
          const uploadPromises = images.map(file => uploadToCloudinary(file.path, folder));
          const results = await Promise.all(uploadPromises);
          return results;
        } catch (error) {
          console.error('Cloudinary upload error:', error); // Add detailed error logging
          throw new Error('Error uploading images to Cloudinary');
        }
      };
      
  
      const { exteriorImage, interiorImage, rcPhoto } = files;
  
      // Handle exterior images
      if (exteriorImage && exteriorImage.length > 0) {
        await deleteOldImages(existingCar.exteriorImage); // Delete old images
        updateData.exteriorImage = await uploadImages(exteriorImage, 'uploads/partner/car/exterior');
      } else {
        updateData.exteriorImage = existingCar.exteriorImage;
      }
  
      // Handle interior images
      if (interiorImage && interiorImage.length > 0) {
        await deleteOldImages(existingCar.interiorImage); // Delete old images
        updateData.interiorImage = await uploadImages(interiorImage, 'uploads/partner/car/interior');
      } else {
        updateData.interiorImage = existingCar.interiorImage;
      }
  
      // Handle RC photo
      if (rcPhoto && rcPhoto.length > 0) {
        await deleteOldImages(existingCar.rcPhoto); // Delete old image
        updateData.rcPhoto = await uploadToCloudinary(rcPhoto[0].path, 'uploads/partner/car/rcBook');
      } else {
        updateData.rcPhoto = existingCar.rcPhoto;
      }
  
      // Update car details
      const updatedCar = await CarDetails.findByIdAndUpdate(carId, updateData, { new: true });
      if (!updatedCar) {
        throw new Error("Failed to update car.");
      }
  
      return updatedCar;
  
    } catch (error) {
      throw new Error(`Error occurred while updating car data: ${error.message}`);
    }
  }
  

}

module.exports = new CarService()