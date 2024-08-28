const carDetails = require("../../../partner/model/car")

class CarService {
 

  async getAllCarsService({ page, limit }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
      const totalCars = await carDetails.countDocuments()
      const cars = await carDetails.find().skip(skip).limit(pageSize)
      return {
        page:currentPage,
        limit:pageSize,
        total:totalCars,
        cars:cars
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error occurred while fetching car data.");
    }
  }

  async getCarByIdService(carId) {
    try {
      const car = await carDetails.findById(carId);
      if (!car) {
        throw new Error("Car not found.");
      }
      return car;
    } catch (error) {
      console.log(error);
      throw new Error("Error occurred while fetching car data by ID.");
    }
  }
 


}

module.exports = new CarService()