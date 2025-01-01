const mongoose = require("mongoose")

const CarDetailsSchema = new mongoose.Schema({
    partnerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner",
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
        enum:["Diesel" , "Petrol" , "CNG" , "Electric" , "Hybrid" ],
        required:true
    },
    transmission:{
        type:String,
        enum:["Automatic" , "Manual" ],
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
        required:true,
        unique: true
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
        enum:[ "Hour"],
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
    },
    bodyStyle:{
        type:String,
        required:true
    },
    subModel:{
        type:String,
        required:true
    },
    modelYear:{
        type:String,
        required:true
    }
},{timestamps:true})


CarDetailsSchema.statics.calculateAverageRating = async function (carId) {
    const reviews = await mongoose.model('CarReview').find({ carId });
    if (reviews.length === 0) return;

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    await this.findByIdAndUpdate(carId, { rating: averageRating });
};

  const CarDetails = mongoose.model("Car", CarDetailsSchema);
  module.exports = CarDetails;