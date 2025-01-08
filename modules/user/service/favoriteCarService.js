const CarDetails = require('../../partner/model/car');
const FavoriteCar = require('../model/favoriteCar'); 

class FavoriteCarService {
    async addFavoriteCar({ userId, carId }) {
        try {
            if (!userId || !carId) {
                throw new Error('User ID and Car ID are required');
            }
            const car = await CarDetails.findOne({ _id: carId, isDelete: false });
        if (!car) {
            throw new Error('Car not found or is deleted');
        }

            const existingFavorite = await FavoriteCar.findOne({ userId, carId });
            if (existingFavorite) {
                throw new Error('Car is already in favorites');
            }

            const favoriteCar = new FavoriteCar({ userId, carId });
            await favoriteCar.save();
            return { message: "Car added to favorites" };
        } catch (error) {
            console.error('Error adding favorite car:', error); 
            throw error;
        }
    }

    async getFavoriteCars({ userId, limit, page }) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
    
            if (!userId) {
                throw new Error('User ID is required');
            }
    
          
            const favoriteCarsCount = await FavoriteCar.countDocuments({ userId });
            console.log("Favorite cars count for the user:", favoriteCarsCount);
    
            if (favoriteCarsCount === 0) {
                return []; 
            }
    
         
            const favoriteCars = await FavoriteCar.find({ userId })
                .skip(skip)
                .limit(pageSize)
                .populate({
                    path: 'carId', 
                    match: { isDelete: false }, 
                    select: 'companyName modelName subModel modelYear bodyStyle isCarVarified rating numberOfSeat fuelType exteriorImage transmission ownerFullName isDelete' // Select relevant fields
                });
    
           
            console.log("Populated favoriteCars:", favoriteCars);
    
            
            const formattedFavoriteCars = favoriteCars.map((favorite) => {
                const car = favorite.carId;
    
                if (!car) {
                   
                    return null;
                }
    
                console.log(car._id); 
    
                return {
                    carId: car._id,
                    carCompany: car.companyName?.carCompany || "",
                    carModel: car.modelName?.model || "",
                    carSubModel: car.subModel?.subModel || "",
                    modelYear: car.modelYear,
                    bodyStyle: car.bodyStyle?.bodyStyle || "",
                    isCarVerified: car.isCarVarified,
                    rating: car.rating,
                    noOfSeat: car.numberOfSeat,
                    fuelType: car.fuelType,
                    exteriorImage: car.exteriorImage?.[0] || "",
                    transmission: car.transmission || "",
                    ownerName: car.ownerFullName || "",
                    companyLogo: car?.companyName?.logoImage || "",
                    isDelete: car.isDelete,
                };
            }).filter(Boolean); 
    
            return formattedFavoriteCars;
        } catch (error) {
            console.error('Error fetching favorite cars:', error); 
            throw error;
        }
    }
    
    
    
}

module.exports = new FavoriteCarService();
