const mongoose = require("mongoose")

const CarDetails = new mongoose.Schema({
    partnerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        ref:'Partner',
        required:true
    },
    ownerFullName:{
        type:String,
        required:true
    },
    numberOfSeat:{
        type:Number,
        required:true
    },
    numberOfDoors:{
        type:Number,
        required:true
    },
    fuelType:{
        type:String,
        enum:["Diesel" , "Petrol" , "CNG" , "Electric"],
        required:true
    },
    transmission:{
        type:String,
        enum:["Automatic" , "Menual" ],
        required:true
    },
    ac:{
        type:Boolean,
        required:true
    },
    sunRoof:{
        type:Boolean,
        required:true
    },
    carNumber:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    modelName:{
        type:String,
        required:true
    },
    rcNumber:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        required:true
    },
    unit:{
        type:String,
        enum:["Km" , "Day" , "Hour"],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    exteriorImage:{
        type:[String],
        required:true
    },
    interiorImage:{
        type:[String],
        required:true
    },
    rcPhoto:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    latitude:{
        type:Number,
        required:true
    },
    longitude:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:false,
        default:0
    },
    isCarVarified:{
        type:Boolean,
        required:false,
        default:false
    }
},{timestamps:true})

const carDetails = mongoose.model("Car",CarDetails);
module.exports = carDetails