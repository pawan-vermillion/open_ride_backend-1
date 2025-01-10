const {model , Schema, default: mongoose} = require("mongoose")
const bcrypt = require('bcrypt')
const {generateToken} = require("../../shared/Service/authenication")
const timestampFormatter = require("../../../timestampFormatter.js");
mongoose.plugin(timestampFormatter);

const walletHistorySchema = new Schema({
   partnerId :{
    type :mongoose.Schema.Types.ObjectId,
    ref:"Partner",
    required:true
   },
   userId :{
    type :mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:false
   },
   bookingId :{
    type :mongoose.Schema.Types.ObjectId,
    ref:"Booking",
    required:false
   },
   genratedBookingId :{
    type :Number,
    ref:"Booking",
    required:false
   },
   transactionType :{
    type: String,
    enum: ["Credit", "Debit", "Withdraw", "Refund"],
    required: true,
   },
   UiType  :{
    type: String,
    enum: ["Wallet", "Withdraw"],
    required: true,
   },
   status  :{
    type: String,
    enum: ["Confirmed", "Pending", "Rejected"],
    required: true,
    default: "Pending"
   },
   paymentId :{
    type :String,
    required:false
   },
   amount :{
    type :Number,
    required:true
   },
   isWithdrewble :{
    type :Boolean,
    required:false,
    default:false
   },

},
    {timestamps : true}
)

const walletHistory = mongoose.model("walletHistory", walletHistorySchema)
module.exports = walletHistory;