const mongoose = require("mongoose")

const CarCompany = new mongoose.Schema({
   carCompany :{
    type:String,
    required:true,
    unique:true
   } ,
   logoImage: {
       type: String, 
       required: false
   }
})

const carCompany = mongoose.model("CarCompnay",CarCompany);
module.exports = carCompany