const FavoriteCar = require("../model/favoriteCar")

class FavoriteCarService {
    addFavoriteCar(userId , carId){
        try {
            const favoriteCar = new FavoriteCar({userId , carId})  
                return favoriteCar.save();
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new FavoriteCarService()