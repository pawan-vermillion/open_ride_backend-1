const mongoose = require("mongoose")

const CarCompany = new mongoose.Schema({
   carCompany :{
    type:String,
    required:true,
    unique:true
   } 
})

const carCompany = mongoose.model("CarCompnay",CarCompany);
module.exports = carCompany