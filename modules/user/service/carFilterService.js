const carDetails = require("../../partner/model/car")

class CarFilterService {
    async addCarFilter(carFilterData) {
        try {
            // Save the car filter data
            const carFilter = new CarFilter(carFilterData); 
            await carFilter.save();

            // Filter cars based on the provided price range
            return await Car.find({
                price: { $gte: carFilterData.minimumPrice, $lte: carFilterData.maximumPrice }
            });
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = new CarFilterService()