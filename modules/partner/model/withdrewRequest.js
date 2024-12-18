
const mongoose = require('mongoose');

const WithdrawRequestSchema = new mongoose.Schema({
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    amount: {
        type: Number
        , required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    type:{
        type:String,
        enum:['withdrew'],
        default:'withdrew',
        
    }
} ,{ timestamps: true });

module.exports = mongoose.model('WithdrawRequest', WithdrawRequestSchema);
