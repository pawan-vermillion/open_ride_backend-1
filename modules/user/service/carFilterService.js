const carDetails = require("../../partner/model/car")

class CarFilterService {
    async addCarFilter(carFilterData) {
        try {
            const { minimumPrice, maximumPrice } = carFilterData;

            
            if (minimumPrice > maximumPrice) {
                throw new Error("Invalid price range");
            }

           
            return await carDetails.find({
                rate: { $gte: minimumPrice, $lte: maximumPrice }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CarFilterService()