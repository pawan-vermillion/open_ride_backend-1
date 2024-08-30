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

    getUnverifiedAllCar = async ({limit, page, filter}) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize

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

            const query = {...filterQuery}
            const allCar = await CarDetails.find(query)
            .skip(skip)
            .limit(pageSize)
            .exec();

            const total = await CarDetails.countDocuments(query)
            return {
                status: 200,
                message: "All Car fetched successfully",
                allCar: allCar,
                total,
              };
        } catch (error) {
            console.log(error);
            
            throw error;
        }
    }
}
module.exports = new CarVerificationService();