const CarBooking = require("../../shared/model/booking");
const Car = require("../../partner/model/car");
const moment = require("moment")
const crypto = require("crypto")
const Partner = require("../../partner/model/partner")
const walletHistory = require("../../partner/model/walletBalance")


class CarBookingService {

    generateDateRange = (startDate, endDate) => {
        const dates = [];
        let currentDate = moment(startDate);
        const end = moment(endDate);

        while (currentDate <= end) {
            dates.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'days');
        }

        return dates;
    };

    checkCarAvailable = async ({ carId }) => {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 14);

            const bookings = await CarBooking.find({ carId }).select('bookedDates');


            const bookedDates = bookings.flatMap(booking =>
                booking.bookedDates.map(date => date.toISOString().split('T')[0])
            );


            const checkDates = [];
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                checkDates.push(date.toISOString().split('T')[0]);
            }


            return checkDates.map(date => ({
                date: date,
                isAvailable: !bookedDates.includes(date)
            }));

        } catch (error) {
            throw new Error(`Error checking car availability: ${error.message}`);
        }
    }

    checkAvailabilityForRange = async ({ carId, startDate, endDate }) => {
        try {
            const bookings = await CarBooking.find({ carId }).select('bookedDates');

            const bookedDates = bookings.flatMap(booking =>
                booking.bookedDates.map(date => date.toISOString().split('T')[0])
            );

            const checkDates = this.generateDateRange(startDate, endDate);

            return checkDates.map(date => ({
                date: date,
                isAvailable: !bookedDates.includes(date)
            }));
        } catch (error) {
            throw new Error(`Error checking car availability for range: ${error.message}`);
        }
    };

    getBookingSummary = async ({ userId, carId, data }) => {
        try {
            const { pickUpData, returnData, member } = data;

            const car = await Car.findById(carId);
            if (!car) {
                throw new Error("Car Not Found");
            }

            const pickUpDateTime = `${pickUpData.pickUpDate} ${pickUpData.pickUpTime}`;
            const returnDateTime = ` ${returnData.returnDate} ${returnData.returnTime}`;
            const pickUpMoment = moment(pickUpDateTime, 'YYYY-MM-DD HH:mm');
            const returnMoment = moment(returnDateTime, 'YYYY-MM-DD HH:mm');



            // Check availability for the date range
            const availability = await this.checkAvailabilityForRange({
                carId,
                startDate: pickUpMoment.format('YYYY-MM-DD'),
                endDate: returnMoment.format('YYYY-MM-DD')
            });

            if (availability.some(date => !date.isAvailable)) {
                console.log('Unavailable Dates:', availability.filter(date => !date.isAvailable));
                throw new Error("Car is not available for the selected dates");
            }

            const bookedDates = this.generateDateRange(pickUpMoment.format('YYYY-MM-DD'), returnMoment.format('YYYY-MM-DD'));
            const totalHour = returnMoment.diff(pickUpMoment, 'hours');


            const sgstRate = parseFloat(process.env.SGST_RATE) || 0;
            const cgstRate = parseFloat(process.env.CGST_RATE) || 0;
            let subTotal = car.rate * totalHour;






            const discount = 0;
            const sgst = (subTotal - discount) * (sgstRate / 100);
            const cgst = (subTotal - discount) * (cgstRate / 100);
            const totalTax = sgst + cgst;
            const commisionRate = parseFloat(process.env.COMMISSION_RATE) || 0;
            const totalCommisionTax = (subTotal - discount) * (commisionRate / 100);
            const commisionAmmount = totalCommisionTax;
            const partnerAmmount = subTotal - discount - commisionAmmount - totalTax;
            const userAmmount = subTotal - discount - commisionAmmount - totalTax;

            let orderId;
            do {
                orderId = crypto.randomBytes(16).toString("hex");
            } while (await CarBooking.exists({ "summary.orderId": orderId }));

            const bookingData = {
                carId,
                partnerId: car.partnerId,
                userId,
                pickUpData,
                returnData,
                member,
                summary: {
                    unit: 'Hour',
                    rate: car.rate,
                    totalHour,
                    subTotal,
                    discount,
                    taxRate: sgstRate + cgstRate,
                    commisionRate,
                    sgst,
                    cgst,
                    commisionAmmount,
                    partnerAmmount,
                    userAmmount,
                    orderId,
                    totalCommisionTax,
                    totalTax,
                },
                bookedDates,
                status: "pending",
                expiresAt: moment().add(30, 'minutes').toDate()
            };

            const booking = new CarBooking(bookingData);
            await booking.save();
            return booking;
        } catch (error) {
            throw new Error(`Error generating booking summary: ${error.message}`);
        }
    };

    removeExpiredBookings = async () => {
        try {
            const now = new Date();
            await CarBooking.deleteMany({
                status: 'pending',
                expiresAt: { $lt: now }
            });
        } catch (error) {
            throw new Error(`Error removing expired bookings: ${error.message}`);
        }
    };

    bookingVerification = async ({  orderId, paymentId, signature, bookingId }) => {
        try {
            const booking = await CarBooking.findById({ _id: bookingId });


            if (!booking) {
                throw new Error('Booking not found');
            }



            const isPaymentVerified = await this.verifyPayment(orderId, paymentId, signature);
            if (!isPaymentVerified) {
                throw new Error('Payment verification failed');
            }

            booking.status = 'confirmed';
            booking.paymentDetails.isPaymentVerified = true;
            booking.paymentDetails.paymentId = paymentId;
            booking.paymentDetails.orderId = orderId;
            await booking.save();

            const partner = await Partner.findById(booking.partnerId);

            if (!partner) {
                throw new Error('Partner not found');
            }

            
            const totalAmount = booking.summary.subTotal - booking.summary.discount - booking.summary.commisionAmmount - booking.summary.totalTax;
            
            
            // add wallet balance in partner account
            partner.walletBalance = (parseFloat(partner.walletBalance) || 0) + totalAmount;
            // GENERATE   PARTNER WALLET TRANSACTION
           
            const userId = booking.userId;
            const transactionType = 'Credit';
       
const walletHistoryEntry = new walletHistory({
    partnerId : booking.partnerId,
    userId,
    transactionType,
    amount: totalAmount,
    bookingId: booking._id,
});

await walletHistoryEntry.save();



        
        await partner.save().catch(err => console.error('Save Error:', err));
            return booking;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    verifyPayment = async (orderId, paymentId, signature) => {
        const generatedSignature = crypto
            .createHmac('sha256', 'your_secret_key')
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        return true;
    };





}






module.exports = new CarBookingService();