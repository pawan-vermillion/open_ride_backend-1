const CarFilterService = require("../service/carFilterService")

class CarFilterController {
    async addCarFilter(req, res) {
        try {
            const { minimumPrice, maximumPrice } = req.body;

            
            if (minimumPrice > maximumPrice) {
                return res.status(400).json({ message: "Invalid price range" });
            }

           
            const filteredCars = await CarFilterService.addCarFilter({ minimumPrice, maximumPrice });

           
            res.status(200).json({ message: "Cars retrieved successfully", cars: filteredCars });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}

module.exports = new CarFilterController()