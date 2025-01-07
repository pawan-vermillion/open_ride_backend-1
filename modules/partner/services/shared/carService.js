const CarDetails = require("../../model/car");
const { uploadToCloudinary, deleteOldImage, cloudinary } = require('../../../shared/config/multer');

class CarService {



   createCarService = async (carData) => {
    try {
      // Save car data in the database
      const newCar = await CarDetails.create(carData);
      return newCar;
    } catch (error) {
      console.log(error)
      throw new Error("Error occurred while creating a new Car: " + error.message);
    }
  };
  







 


  async getAllCarsService({ page, limit }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
      const totalCars = await CarDetails.countDocuments();
      const cars = await CarDetails.find().skip(skip).limit(pageSize);
      return cars ;
    } catch (error) {
      throw new Error("Error occurred while fetching car data.");
    }
  }





  addCarImages = async (carId, partnerId, carData) => {
    try {
     
      const car = await CarDetails.findOne({ _id: carId, partnerId });
  
      if (!car) {
        throw new Error("Car not found");
      }
  
   
      Object.keys(carData).forEach(key => {
        if (car[key] && Array.isArray(car[key])) {
         
          car[key] = [...car[key], ...carData[key]];
        } else {
         
          car[key] = carData[key];
        }
      });
  
     
      await car.save();
  
      return car; 
    } catch (error) {
      console.error("Error updating car images:", error.message);
      throw new Error(error.message);
    }
  };
  



  removeCarImageReference = async (carId, partnerId, type, imageUrl) => {
    try {
     
        const car = await CarDetails.findOne({ _id: carId, partnerId });

        if (!car) {
            throw new Error('Car not found or not owned by the partner');
        }

 

        let imageFields = ['exteriorImage', 'interiorImage',  'logoImage', 'driverImage'];

        let imageUpdated = false; 

        for (const field of imageFields) {
            if (Array.isArray(car[field])) {
            
                const index = car[field].indexOf(imageUrl);
                if (index > -1) {
                    car[field].splice(index, 1);
                    imageUpdated = true;
                    console.log(`Image found and removed from field: ${field}`);
                }
            } else if (car[field] === imageUrl) {
            
                car[field] = null;
                imageUpdated = true;
                console.log(`Image found and removed from field: ${field}`);
            }
        }

        if (!imageUpdated) {
            throw new Error('Image not found in car records');
        }

      
        await car.save();
       

        return car;
    } catch (error) {
        console.error('Error removing car image reference:', error);
        throw new Error(error.message);
    }
};

  

  





















}

module.exports = new CarService();



