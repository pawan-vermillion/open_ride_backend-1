const CarFilterService = require("../service/carFilterService")

class CarFilterController {
        async addCarFilter(req, res) {
            try {
                const filteredCars = await CarFilterService.addCarFilter(req.body);
                res.status(200).json({ message: "Added Successfully", cars: filteredCars });
            } catch (error) {
                res.status(500).json({ message: "Internal Server Error", error: error.message });
            }
        }
}

module.exports = new CarFilterController()