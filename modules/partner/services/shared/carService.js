const carDetails = require("../../model/car")

class CarService {
  async createCarService(carData) {
    try {
      const newCarAdd = new carDetails(carData);
      await newCarAdd.save();

      return { message: "New Car add successflluy" };
    } catch (error) {
      console.log(error)
      console.error("Error creating car:", error.message);
      throw new Error("Error occurred while creating a new Car.");
    }
  }

  async getAllCarsService({ partnerId, page, limit }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
      const totalCars = await carDetails.countDocuments({ partnerId })
      const cars = await carDetails.find({ partnerId: partnerId }).skip(skip).limit(pageSize)
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

  async updateCarService(carId, updateData) {
    try {
      const car = await carDetails.findByIdAndUpdate(carId, updateData, { new: true });
      if (!car) {
        throw new Error("Car not found.");
      }
      return car;
    } catch (error) {
      console.log(error);
      throw new Error("Error occurred while updating car data.");
    }
  }


}

module.exports = new CarService()