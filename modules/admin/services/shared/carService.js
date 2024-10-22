const CarDetails = require("../../../partner/model/car")

class AdminCarService {
 

  async getAllCarsService({search , page, limit }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
      const searchQuery = search
      ? {
          $or: [
            { carNumber: { $regex: search, $options: "i" } },
            { companyName: { $regex: search, $options: "i" } },
            { modelName: { $regex: search, $options: "i" } },
          ],
        }
      : {};
      const query = {...searchQuery}
      const totalCars = await CarDetails.countDocuments()
      const cars = await CarDetails.find(query).skip(skip).limit(pageSize)
      
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

  async getCarByIdService({carId}) {
    try {
      
      
      const car = await CarDetails.findById(carId) .populate("partnerId", 'emailAddress phoneNumber firstName lastName profileImage')
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