const Partner = require("../../../partner/model/partner");
const User = require("../../../user/model/user");
const carDetails = require("../../../partner/model/car");
const CarBooking = require("../../../shared/model/booking");

class DashboardService {
    getDashbaordCountDetails = async () => {
        try {
            const partnerCount = await Partner.find({}).countDocuments();
            const userCount = await User.find({}).countDocuments();
            const carCount = await carDetails.find({}).countDocuments();

            // Aggregate booking data
            const bookingAggregation = await CarBooking.aggregate([
                {
                    $group: {
                        _id: null,
                        totalBooking: { $sum: 1 },
                        totalUserAmount: { $sum: { $ifNull: ["$userAmount", 0] } }, // Handle null or missing
                        totalPartnerAmount: { $sum: { $ifNull: ["$partnerAmount", 0] } }, // Handle null or missing
                        totalCommission: { $sum: { $ifNull: ["$commission", 0] } }, // Handle null or missing
                        totalTax: { $sum: { $ifNull: ["$tax", 0] } }, // Handle null or missing
                    },
                },
            ]);
            

            const bookingData = bookingAggregation[0] || {
                totalBooking: 0,
                totalUserAmount: 0,
                totalPartnerAmount: 0,
                totalCommission: 0,
                totalTax: 0,
            };

            // Get counts of different booking statuses
            const confirmedBookingCount = await CarBooking.countDocuments({ status: "confirmed" });
            const pendingBooking = await CarBooking.countDocuments({ status: "pending" });
            const cancelledBooking = await CarBooking.countDocuments({ status: "cancelled" });
            const completedBooking = await CarBooking.countDocuments({ status: "completed" });

            // Calculate commission on tax
            const commissionOnTax = (bookingData.totalCommission * bookingData.totalTax) / 100;

            // Final amount: Commission + Tax + Commission on Tax
            const totalCommissionAndTax = bookingData.totalCommission + bookingData.totalTax + commissionOnTax;

            return {
                account: {
                    totalPartner: partnerCount,
                    totalUser: userCount,
                    totalCar: carCount,
                },
                booking: {
                    totalBooking: bookingData.totalBooking,
                    confirmBooking: confirmedBookingCount,
                    pendingBooking: pendingBooking,
                    cancelledBooking: cancelledBooking,
                    completedBooking: completedBooking,
                    userTotalAmount: bookingData.totalUserAmount, // Total money from users
                    partnerTotalAmount: bookingData.totalPartnerAmount, // Total money for partners
                    commission: bookingData.totalCommission, // Total commission
                    tax: bookingData.totalTax, // Total tax
                    commissionOnTax: commissionOnTax, // Commission on tax
                    totalCommissionAndTax: totalCommissionAndTax, // Total commission + tax + commission on tax
                },
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = new DashboardService();
