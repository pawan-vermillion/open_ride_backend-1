const CarDetails = require("../../model/car")

class CarService {
  async createCarService(CarData) {
    try {
      const newCarAdd = new CarDetails(CarData);
      await newCarAdd.save();

      return { message: "New Car add successflluy" };
    } catch (error) {
    
      throw new Error("Error occurred while creating a new Car.");
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


  async updateCarService(carId, updateData) {
    try {
      const car = await CarDetails.findByIdAndUpdate(carId, updateData, { new: true });
      if (!car) {
        throw new Error("Car not found.");
      }
      return car;
    } catch (error) {
  
      throw new Error("Error occurred while updating car data.");
    }
  }


}

module.exports = new CarService()