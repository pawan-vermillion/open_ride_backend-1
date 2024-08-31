const mongoose = require("mongoose")

const favoriteCarSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
}, {timestamps : true})
const FavoriteCar = mongoose.model("favoriteCar" , favoriteCarSchema)
module.exports = FavoriteCar