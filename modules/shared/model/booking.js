const { phone_number } = require("faker/lib/locales/en_CA")
const mongoose = require("mongoose")


const carBooking = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        require: true
    },
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner",
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    pickUpData: {
        pickUpDate: {
            type: String,
            required: true
        },
        pickUpTime: {
            type: String,
            required: true
        },
        pickupLocation: {
            type: String,
            required: true
        },
      
    },
    returnData: {
        returnDate: {
            type: String,
            required: true
        },
        returnTime: {
            type: String,
            required: true
        },
       
    },
    summary: {
        unit: {
            type: String,
            enum: ["Hour" ],
            default:"Hour",
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        totalHour: {
            type: Number,
            required: true
        },
        subTotal: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        taxRate: {
            type: Number,
            required: true
        },
        commisionRate: {
            type: Number,
            required: true
        },
        sgst: {
            type: Number,
            required: true
        },
        cgst: {
            type: Number,
            required: true
        },
        commisionAmmount: {
            type: Number,
            required: true
        },
        partnerAmmount: {
            type: Number,
            required: true
        },
        userAmmount: {
            type: Number,
            required: true
        },
        orderId: {
            type: String,
            required: true
        },
        totalCommisionTax: {
            type: Number,
            required: true
        },
        totalTax: {
            type: Number,
            required: true
        },
        bookingOtp:{
            type:Number,
            required:false,
          }

    },
    paymentDetails: {
        paymentId: {
            type: String,
            required: false,
        },
        orderId: {
            type: String,
            required: false,
        },
        isPaymentVerified: {
            type: Boolean,
            default: false,
        },
        reciptNumber: {
            type: Number,
            default: false,
        },
    },
    bookedDates: [{
        type: Date,
        required: true
      }],
     
      cancelReason: {
        type: String,
        required: false,
      },
      cancelAt: {
        type: Date,
        default:Date.now(),
        required: false,
      },
      cancelBy: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ["onProcess", "pending", "confirmed", "complete", "cancelled"],
        required: true,
        default: "onProcess",
      },
      isCancel: {
        type: Boolean,
        default: false,
      },
      assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: false,
        default:null,
      },
      genratedBookingId:{
        type:Number,
        required:true
      }
      
    

}, { timestamps: true })

const CarBooking = mongoose.model("CarBooking", carBooking)
module.exports = CarBooking