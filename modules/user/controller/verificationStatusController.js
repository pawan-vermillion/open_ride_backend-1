const CarVerificationService = require("../service/verificationStatusService");
const AdminCarService = require("../../admin/services/shared/carService")
class CarVerificationController {

  getVerifiedCars = async (req, res) => {
    const { search, page, limit, userlatitude, userlongitude } = req.query;

    try {
      const verified = await CarVerificationService.getVerifiedCar({
        limit,
        page,
        search,
        userlatitude,
        userlongitude,
      });

      res.status(201).json(verified)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: "An error occurred while fetching cars" });
    }
  };


  getCarById = async (req, res) => {
    const carId = req.params.id;
    try {
      const car = await AdminCarService.getCarByIdService({ carId });
      return res.status(200).json(car);
    } catch (error) {
      res.status(500).json({ message: error.message });

    }
  }

}

module.exports = new CarVerificationController();
