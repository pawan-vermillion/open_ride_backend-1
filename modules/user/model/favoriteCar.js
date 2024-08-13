const mongoose = require("mongoose")

const favoriteCar = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    boxId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Box',
        required: true
    },
}, {timestamps : true})
const FavoriteCar = mongoose.model("favoriteCar" , favoriteCar)
module.exports = FavoriteCar