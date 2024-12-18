const mongoose = require('mongoose');

const RepairCarSchema = new mongoose.Schema({

    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarDetails",  // Ensure the reference is correct
        required: true,
    },
    
    fromtoDate: {
        type: Date,
        required: true
    },
    fromtoTime: {
        type: String,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    toTime: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('RepairCar', RepairCarSchema);
