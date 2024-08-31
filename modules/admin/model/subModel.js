const mongoose = require("mongoose")

const SubModelSchema = new mongoose.Schema({
    modelId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'CarModel'
    },
    subModel: {
        type: String,
        required: true,
        unique: true
    }
})

const SubModel = mongoose.model("subModel", SubModelSchema);
module.exports = SubModel