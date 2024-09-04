const AdminCarService = require("../../services/shared/carService");


class AdminCarController {
 
  getAllCars = async (req, res) => {
    try {
    

      const {search , limit, page } = req.query;
      const cars = await AdminCarService.getAllCarsService({search ,   page, limit });
      
      return res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ message: error.message });
      
    }
  }
  getCarById = async (req, res) => {
    const carId = req.params.id;
    try {
      const car = await AdminCarService.getCarByIdService({carId});
      return res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message });
    
    }
  }
}

module.exports = new AdminCarController();
