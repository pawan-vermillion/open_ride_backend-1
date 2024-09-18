const mongoose = require("mongoose")

const walletBalanceSchema = new mongoose.Schema({
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

const WalletBalance = mongoose.model("walletBalance", walletBalanceSchema)
module.exports = WalletBalance;