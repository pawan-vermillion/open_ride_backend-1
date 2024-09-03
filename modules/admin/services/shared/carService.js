const CarDetails = require("../../../partner/model/car")

class AdminCarService {
 

  async getAllCarsService({partnerId, page, limit }) {
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
      console.error('Error fetching cars:', error);
      throw new Error("Error occurred while fetching car data.");
    }
  }

  async getCarByIdService({carId}) {
    try {
      
      
      const car = await CarDetails.findById(carId);
      if (!car) {
        throw new Error("Car not found.");
      }
      return car;
    } catch (error) {
     
      throw new Error("Error occurred while fetching car data by ID.");
    }
  }
 


}

module.exports = new AdminCarService()