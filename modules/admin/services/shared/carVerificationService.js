const CarDetails = require("../../../partner/model/car")

class CarVerificationService {
    changeCarVeificationStatus = async (carId, statusValue) => {
        try {
            if (statusValue !== "verified" && statusValue !== "unverified") {
                throw new Error("Invaild status Value. Expected 'verified' or 'unverified'");

            };
            const isCarVarified = statusValue == "verified" ? true : false;

            const updateCarStatus = await CarDetails.findByIdAndUpdate(carId, { isCarVarified }, { new: true })

            if (!updateCarStatus) {
                throw new Error("Car not found");

            }
            return {
                status: 200,
                message: "Car verification status updated successfully",
                car: updateCarStatus
            }

        } catch (error) {
            throw error;
        }
    }

    getUnverifiedAllCar = async ({limit, page, filter , search}) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize
            const searchQuery = search
            ? {
                $or: [
                  { carNumber: { $regex: search, $options: "i" } },
                  { companyName: { $regex: search, $options: "i" } },
                  { modelName: { $regex: search, $options: "i" } },
                ],
              }
            : {};
    

            let filterQuery = {}
            switch (filter) {
                case "verified":
                    filterQuery = { isCarVarified: true }
                    break;

                case "unverified":
                    filterQuery = { isCarVarified: false }
                    break;

                case "all":
                default:
                    break;
            }

            const query = {...searchQuery,  ...filterQuery}
            const allCar = await CarDetails.find(query)
            .skip(skip)
            .limit(pageSize)
            .exec();

            const total = await CarDetails.countDocuments(query)
            return {
                status: 200,
                total,
                page:currentPage,
                limit:pageSize,
                allCar: allCar,
              };
        } catch (error) {
         
            
            throw error;
        }
    }

    
}
module.exports = new CarVerificationService();