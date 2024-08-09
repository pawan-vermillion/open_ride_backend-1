const mongoose = require("mongoose")

const AdminNotificationSchema = new mongoose.Schema({
    adminId :{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default : Date.now
    },
    isRead:{
        type:Boolean,
        default:false
    }
},
{timestamps:true},
)
const AdminNotification = mongoose.model("adminNotification",AdminNotificationSchema)
module.exports = AdminNotification