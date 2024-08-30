const {model , Schema, default: mongoose} = require("mongoose")
const bcrypt = require('bcrypt')
const {generateToken} = require("../../shared/Service/authenication")

const walletHistorySchema = new Schema({
   partnerId :{
    type :mongoose.Schema.Types.ObjectId,
    ref:"Partner",
    required:true
   },
   userId :{
    type :mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   bookingId :{
    type :mongoose.Schema.Types.ObjectId,
    ref:"Booking",
    required:true
   },
   transactionType :{
    type: String,
    enum: ["Credit", "Debit", "Withdraw", "Refund"],
    required: true,
   },
   paymentId :{
    type :String,
    required:false
   },
   amount :{
    type :Number,
    required:true
   },

},
    {timestamps : true}
)

const WalletHistory = mongoose.model("walletBalance", walletHistorySchema)
module.exports = WalletHistory;