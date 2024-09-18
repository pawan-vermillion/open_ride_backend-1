const Partner = require("../../../partner/model/partner");
const User = require("../../../user/model/user");
const carDetails = require("../../../partner/model/car");
const CarBooking = require("../../../shared/model/booking");
const moment = require('moment');

class DashboardService {
    getDashboardCountDetails = async (filterParams) => {
        try {
            const partnerCount = await Partner.countDocuments();
            const userCount = await User.countDocuments();
            const carCount = await carDetails.countDocuments();
            
            let match = {};
            const now = moment();
            
            switch(filterParams.filter) {
                case 'today':
                    match.createdAt = { $gte: now.startOf('day').toDate(), $lt: now.endOf('day').toDate() };
                    break;
                case 'lastWeek':
                    match.createdAt = { $gte: now.startOf('week').toDate(), $lt: now.endOf('week').toDate() };
                    break;
                case 'lastMonth':
                    match.createdAt = { $gte: now.startOf('month').toDate(), $lt: now.endOf('month').toDate() };
                    break;
                case 'lastYear':
                    match.createdAt = { $gte: now.startOf('year').toDate(), $lt: now.endOf('year').toDate() };
                    break;
                case 'custom':
                    if (!filterParams.startDate || !filterParams.endDate) {
                        return {
                            account: {
                                totalPartner: partnerCount,
                                totalUser: userCount,
                                totalCar: carCount,
                            },
                            booking: {
                                totalBooking: 0,
                                confirmBooking: 0,
                                pendingBooking: 0,
                                cancelledBooking: 0,
                                completedBooking: 0,
                                userTotalAmount: 0,
                                commissionOnTotal: 0,
                                partnerAmmout: 0,
                            },
                        };
                    }
                    match.createdAt = { $gte: new Date(filterParams.startDate), $lt: new Date(filterParams.endDate) };
                    break;
                default:
                    match = {};
            }

            const bookingAggregation = await CarBooking.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: null,
                        totalBooking: { $sum: 1 },
                        confirmedBookingCount: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
                        pendingBookingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                        cancelledBookingCount: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
                        completedBookingCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                        totalUserAmount: { $sum: { $ifNull: ["$summary.userAmmount", 0] } },
                        totalPartnerAmount: { $sum: { $ifNull: ["$summary.partnerAmmount", 0] } },
                        totalCommission: { $sum: { $ifNull: ["$summary.commisionAmmount", 0] } },
                        totalTax: { $sum: { $ifNull: ["$summary.totalTax", 0] } },
                    },
                },
            ]);

            const bookingData = bookingAggregation[0] || {
                totalBooking: 0,
                confirmedBookingCount: 0,
                pendingBookingCount: 0,
                cancelledBookingCount: 0,
                completedBookingCount: 0,
                totalUserAmount: 0,
                totalPartnerAmount: 0,
                totalCommission: 0,
                totalTax: 0,
            };

            const commissionPercentage = 0.10;
            const expectedCommission = bookingData.totalUserAmount * commissionPercentage;
            const partnerAmmout = bookingData.totalUserAmount - expectedCommission;

            return {
                account: {
                    totalPartner: partnerCount,
                    totalUser: userCount,
                    totalCar: carCount,
                },
                booking: {
                    totalBooking: bookingData.totalBooking,
                    confirmBooking: bookingData.confirmedBookingCount,
                    pendingBooking: bookingData.pendingBookingCount,
                    cancelledBooking: bookingData.cancelledBookingCount,
                    completedBooking: bookingData.completedBookingCount,
                    userTotalAmount: bookingData.totalUserAmount,
                    commissionOnTotal: bookingData.totalCommission,
                    partnerAmmout: partnerAmmout,
                },
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = new DashboardService();
