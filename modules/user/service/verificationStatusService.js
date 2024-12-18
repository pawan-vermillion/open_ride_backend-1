const CarDetails = require("../../partner/model/car");
const { GetDistance } = require('../utils/getDistance');

class CarVerificationService {
    getVerifiedCar = async ({ limit, page, search, userlongitude, userlatitude }) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1; 
            const skip = (currentPage - 1) * pageSize;

            const userLat = parseFloat(userlatitude);
            const userLong = parseFloat(userlongitude);
            const maxDistance = 15;

     
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
                isCarVarified: true,
            };

         
            const allCar = await CarDetails.find(query)
                .skip(skip)
                .limit(pageSize)
                .exec();

            

 
            let nearbyCars = allCar.filter(car => {
                const carLat = parseFloat(car.latitude);
                const carLong = parseFloat(car.longitude);

                // Ensure the car's coordinates are valid
                if (isNaN(carLat) || isNaN(carLong)) {
                    return false;
                }


                const distance = GetDistance(userLat, userLong, carLat, carLong);

             
                car.distance = distance.toFixed(2);

                return distance <= maxDistance;
            });


            nearbyCars.forEach(car => {
                console.log(`Car: ${car.modelName || "N/A"}, Distance: ${car.distance} km`);
            });

          
            if (nearbyCars.length < pageSize) {
                const remainingCars = allCar.filter(car => !nearbyCars.includes(car));
                nearbyCars = [...nearbyCars, ...remainingCars].slice(0, pageSize);
            }

            // Get the total count of verified cars
            const total = await CarDetails.countDocuments(query);

            return nearbyCars
            
        } catch (error) {
            console.error("Error in getVerifiedCar:", error.message);
            throw error;
        }
    };
}

module.exports = new CarVerificationService();
