const mongoose= require("mongoose")



const offlineBookingSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    carId :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'CarDetails',
        required: true,
    },
    phoneNumber:{
        type:String,
        required:true
    },
    amount: {
        type: Number,
        required: true
    },
    carComapny: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    pickUpDate: {
        type: String,
        required: true
    },
    returnDate: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)



const OfflineBooking = mongoose.model("offlineBooking", offlineBookingSchema)
module.exports = OfflineBooking