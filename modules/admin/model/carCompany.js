const mongoose = require("mongoose")

const CarCompanySchema = new mongoose.Schema({
   carCompany :{
    type:String,
    required:true,
    unique:true
   } ,
   logoImage: {
       type: String, 
       required: true
   }
})

const carCompany = mongoose.model("CarCompnay",CarCompanySchema);
module.exports = carCompany