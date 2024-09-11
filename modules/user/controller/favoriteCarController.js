const FavoriteCarService = require('../service/favoriteCarService');

class FavoriteCarController {
    async addFavoriteCar(req, res) {
        try {
            const userId = req.user.id;
            const { carId } = req.body; 
            if (!carId) {
                return res.status(400).json({ message: "Car ID is required" });
            }

            const result = await FavoriteCarService.addFavoriteCar({ userId, carId });
            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'Car is already in favorites') {
                return res.status(409).json({ message: error.message });
            }
            if (error.message === 'User ID and Car ID are required') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getFavoriteCars(req, res) {
        try {
            const userId = req.user.id;
            const { limit, page } = req.query;
            const favoriteCars = await FavoriteCarService.getFavoriteCars({userId ,  limit, page});
            res.status(200).json(favoriteCars);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = new FavoriteCarController();
