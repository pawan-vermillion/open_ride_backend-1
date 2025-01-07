
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    driverImage:{
        type:String,
        required:false
    },
    trips: [{
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CarBooking', 
            required: true
        },
        fromDateTime: {
            type: Date,
            required: true
        },
        toDateTime: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        }
    }]
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
