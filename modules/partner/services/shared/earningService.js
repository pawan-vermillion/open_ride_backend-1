const CarBooking = require("../../../shared/model/booking");
const moment = require("moment");

class EarningService {
  earning = async ({ partnerId, startDate, endDate }) => {
    try {
      const now = moment().endOf("day");
      const today = moment().startOf("day");
      const lastWeek = moment().subtract(1, "weeks").startOf("week");
      const lastMonth = moment().subtract(1, "months").startOf("month");
      const lastYear = moment().subtract(1, "years").startOf("year");
     

      const start = startDate ? moment(startDate).startOf("day").toDate() : null;
      const end = endDate ? moment(endDate).endOf("day").toDate() : null;

      if (start > end) {
        throw new Error("Start date cannot be later than end date");
      }

      const todayBookings = await CarBooking.find({
        partnerId,
        status: { $in: ["confirmed", "completed"] },
        createdAt: { $gte: today.toDate(), $lte: now.toDate() }
      });

      const lastWeekBookings = await CarBooking.find({
        partnerId,
        status: { $in: ["confirmed", "completed"] },
        createdAt: { $gte: lastWeek.toDate(), $lte: now.toDate() }
      });

      const lastMonthBookings = await CarBooking.find({
        partnerId,
        status: { $in: ["confirmed", "completed"] },
        createdAt: { $gte: lastMonth.toDate(), $lte: now.toDate() }
      });

      const lastYearBookings = await CarBooking.find({
        partnerId,
        status: { $in: ["confirmed", "completed"] },
        createdAt: { $gte: lastYear.toDate(), $lte: now.toDate() }
      });

      
     
      let customBookings = [];
      if (start && end) {
        customBookings = await CarBooking.find({
          partnerId,
          status: { $in: ["confirmed", "completed"] },
          createdAt: { $gte: start, $lte: end }
        });
      }
      
      const calculateEarnings = bookings =>
        bookings.reduce((sum, booking) => sum + booking.summary.partnerAmmount, 0);

      const todayEarning = calculateEarnings(todayBookings);
      const lastWeekEarning = calculateEarnings(lastWeekBookings);
      const lastMonthEarning = calculateEarnings(lastMonthBookings);
      const lastYearEarning = calculateEarnings(lastYearBookings);
      const customEarning = start && end ? calculateEarnings(customBookings) : 0;

      return {
        todayEarning: todayEarning || 0,
        lastWeekEarning: lastWeekEarning || 0,
        lastMonthEarning: lastMonthEarning || 0,
        lastYearEarning: lastYearEarning || 0,
        customEarning: customEarning || 0
      };
    } catch (error) {
      console.error('Error calculating earnings:', error);
      throw error;
    }
  };
}

module.exports = new EarningService();
