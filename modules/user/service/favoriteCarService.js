const FavoriteCar = require('../model/favoriteCar'); 

class FavoriteCarService {
    async addFavoriteCar({ userId, carId }) {
        try {
            if (!userId || !carId) {
                throw new Error('User ID and Car ID are required');
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

    async getFavoriteCars({userId ,  limit , page}) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
            const total = await FavoriteCar.countDocuments()
            if (!userId) {
                throw new Error('User ID is required');
            }

            const favoriteCars = await FavoriteCar.find({ userId }).skip(skip)
            .limit(pageSize);;
            return {
                page: currentPage,
                limit: pageSize,
                total:total,
                favoriteCars};
        } catch (error) {
            console.error('Error fetching favorite cars:', error); 
            throw error;
        }
    }
}

module.exports = new FavoriteCarService();
