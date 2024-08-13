const mongoose = require("mongoose")

const CarModel = new mongoose.Schema({
   companyId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'CarCompnay'
   },
   model:{
    type:String,
    required:true
   }
})

const carModel = mongoose.model("CarModel",CarModel);
module.exports = carModel