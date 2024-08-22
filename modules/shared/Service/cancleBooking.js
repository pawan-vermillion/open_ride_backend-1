const CarBooking = require("../model/booking")
const paymentGetWay = require("../payment/paymentGetWay")


class CarBookingServic {
   

    


    PaymentProccess(bookingId , paymentDetails){
        const booking = CarBooking.findById(bookingId)
        if(!booking){
            throw new error('Booking Not Found')
        }

        const paymentResult  = paymentGetWay.Process(paymentDetails)
        if (paymentResult.success) {
            booking.paymentStatus = 'Confirm';
             booking.save();
        }

        return paymentResult;
    }
    
    
}

module.exports =  new CarBookingServic()