const CarDetails = require("../../../partner/model/car")

class CarGetByPartnerIdService {
    async GetCar(partnerId , limit , page) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
            const total = await CarDetails.countDocuments({partnerId})
            const cars = await CarDetails.find({partnerId}).skip(skip)
            .limit(pageSize);
            if (!cars || cars.length === 0) {
               return []
            }
            return {
                page: currentPage,
                limit: pageSize,
                totalCar: total,
                cars
            };
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new CarGetByPartnerIdService()