const Partner = require("../../../partner/model/partner")
const User = require("../../../user/model/user")
const carDetails = require("../../../partner/model/car")
const CarBooking = require("../../../shared/model/booking")


class DashboardService {
    getDashbaordCountDetails = async ()=>{
        try {
            const partnerCount = await Partner.find({}).countDocuments();
            const userCount = await User.find({}).countDocuments();
            const  carCount = await carDetails.find({}).countDocuments();

            let query = {};

            const allBookingCount = await CarBooking.find({}).countDocuments();

            const confirmedBookingCount = await CarBooking.find({
                ...query,
                status :"confirmed",
            }).countDocuments();
            const pendingBooking = await CarBooking.find({
                ...query,
                status  :"pending",
            }).countDocuments();
            const cancelledBooking = await CarBooking.find({
                ...query,
                status :"cancelled",
            }).countDocuments();
            const completedBooking = await CarBooking.find({
                ...query,
                status :"completed"
            }).countDocuments();

            return {
                account :{
                    totalPartner :partnerCount,
                    totalUser :userCount,
                    totalCar :carCount
                },
                booking:{
                    totalBooking : allBookingCount,
                    confirmBooking :confirmedBookingCount,
                    pendingBooking : pendingBooking,
                    cancelledBooking : cancelledBooking,
                    completedBooking : completedBooking

                }
            }

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DashboardService()