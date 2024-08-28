const { validationResult } = require('express-validator');
const CarService = require("../../services/shared/carService");


class CarController {
 



  getAllCars = async (req, res) => {
    try {
      const partnerId = req.user.id;

      const { limit, page } = req.query;
      const cars = await CarService.getAllCarsService({ partnerId, page, limit });
      return res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error);
    }
  }
  getCarById = async (req, res) => {
    const carId = req.params.id;
    try {
      const car = await CarService.getCarByIdService(carId);
      return res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error);
    }
  }

 
  
  

}

module.exports = new CarController();
