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
        pickUpLocation: {
            type: String,
            required: true
        },
        pickUpLatitude: {
            type: String,
            required: true
        },
        pickUpLongitude: {
            type: String,
            required: true
        }
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
        returnLocation: {
            type: String,
            required: true
        },
        returnLatitude: {
            type: String,

            required: true
        },
        returnLongitude: {
            type: String,
            required: true
        }
    },
    member: {
        totalMember: {
            type: Number,
            required: true
        },
        memberDetails: [
            {
                fullName: {
                    type: String,
                    required: true
                },
                age: {
                    type: Number,
                    required: true
                }
            }
        ]
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
    },
    bookedDates: [{
        type: Date,
        required: true
      }],
      
      isCancel: {
        type: Boolean,
        default: false,
      },
      cancelReason: {
        type: String,
        required: false,
      },
      cancelAt: {
        type: Date,
        required: false,
      },
      cancelBy: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        required: true,
        default: "pending",
      },
    

}, { timestamps: true })

const CarBooking = mongoose.model("CarBooking", carBooking)
module.exports = CarBooking