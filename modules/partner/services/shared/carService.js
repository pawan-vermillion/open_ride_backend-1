const carDetails = require("../../model/car")

class CarService {
    async createCarService(carData) {
        try {
            const newCarAdd = new carDetails(carData);
            await newCarAdd.save();
      
            return { message: "New Car add successflluy" };
          } catch (error) {
            console.log(error)
            throw new Error("Error occurred while creating a new Car.");
          }
    }
}

module.exports = new CarService()