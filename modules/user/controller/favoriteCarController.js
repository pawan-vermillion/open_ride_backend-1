const FavoriteCarService = require("../service/favoriteCarService")

class favoriteCarController {
    async addFavoriteCar(req, res) {
        try {
            const userId = req.user.id
            await FavoriteCarService.addFavoriteCar(userId, req.body.carId);
            res.status(200).json({ message: "Car save in favorite car" })
        } catch (error) {
            res.status(500).json({ message: " Internal Serval Error" })
        }
    }
}

module.exports = new favoriteCarController()