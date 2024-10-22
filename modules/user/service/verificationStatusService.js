const CarDetails = require("../../partner/model/car");
const { GetDistance, deg2rad } = require('../utils/getDistance')

class CarVerificationService {


    getVerifiedCar = async ({ limit, page, search, userlongitude, userlatitude }) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;

            const userLat = parseFloat(userlatitude);
            const userLong = parseFloat(userlongitude);
            const maxDistance = 15; // 15 km ni distance

            if (isNaN(userLat) || isNaN(userLong)) {
                throw new Error("Invalid user coordinates");
            }

            const searchQuery = search
                ? {
                    $or: [
                        { city: { $regex: search, $options: "i" } },
                        { companyName: { $regex: search, $options: "i" } },
                        { modelName: { $regex: search, $options: "i" } },
                    ],
                }
                : {};

            const query = {
                ...searchQuery,
                isCarVarified: true
            };

            const allCar = await CarDetails.find(query)
                .skip(skip)
                .limit(pageSize)
                .exec();

            // Najik na car fetch karo (15 km ni radius)
            let nearbyCars = allCar.filter(car => {
                const carLat = parseFloat(car.latitude);
                const carLong = parseFloat(car.longitude);

                if (isNaN(carLat) || isNaN(carLong)) {
                    return false;
                }

                const distance = GetDistance(userLat, userLong, carLat, carLong);
                car.distance = distance.toFixed(2);
                return distance <= maxDistance;
            });

            // Pela najik na cars moklo, baki cars pachhi fetch karo
            if (nearbyCars.length < pageSize) {
                const remainingCars = allCar.filter(car => !nearbyCars.includes(car));
                nearbyCars = [...nearbyCars, ...remainingCars].slice(0, pageSize);
            }

            const total = await CarDetails.countDocuments(query);

            return {
                page: currentPage,
                limit: pageSize,
                total,
                filteredcarDetails: nearbyCars
            };
        } catch (error) {
            throw error;
        }
    };








    // getVerifiedCar = async ({ limit, page, search }) => {
    //     try {
    //         const pageSize = parseInt(limit) || 10;
    //         const currentPage = parseInt(page) || 1;
    //         const skip = (currentPage - 1) * pageSize;

    //         const searchQuery = search
    //             ? {
    //                   $or: [
    //                       { city: { $regex: search, $options: "i" } },
    //                       { companyName: { $regex: search, $options: "i" } },
    //                       { modelName: { $regex: search, $options: "i" } },
    //                   ],
    //               }
    //             : {};

    //         const query = {
    //             ...searchQuery,
    //             isCarVarified: true 
    //         };

    //         const allCar = await CarDetails.find(query)
    //             .skip(skip)
    //             .limit(pageSize)
    //             .exec();

    //         const total = await CarDetails.countDocuments(query);

    //         return {

    //             page: currentPage,
    //             limit: pageSize,
    //             total,
    //             allCar
    //         };
    //     } catch (error) {

    //         throw error;
    //     }
    // };


}

module.exports = new CarVerificationService();
