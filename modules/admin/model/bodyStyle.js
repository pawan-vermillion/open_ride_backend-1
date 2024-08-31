const mongoose = require("mongoose")

const BodyStyleSchema = new mongoose.Schema({
   bodyStyle :{
    type:String,
    required:true,
    unique:true
   } 
})

const BodyStyle = mongoose.model("bodyStyle",BodyStyleSchema);
module.exports = BodyStyle