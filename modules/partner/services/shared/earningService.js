const CarBooking = require("../../../shared/model/booking");
const moment = require("moment");

class EarningService {
  earning = async ({ partnerId, filter, startDate, endDate }) => {
    try {
      const getEarningsForPeriod = async (start, end) => {
        console.log(`Fetching earnings for period: ${start.toISOString()} to ${end.toISOString()}`);
    
        const bookings = await CarBooking.find({
            partnerId,
            status: { $in: ["confirmed", "completed"] },
            createdAt: { $gte: start, $lte: end },
        });
    
        console.log(`Number of bookings found: ${bookings.length}`);
        
        return bookings.reduce((sum, booking) => sum + booking.summary.partnerAmmount, 0);
    };
    

      const today = moment().startOf("day").toDate();
      const endOfToday = moment().endOf("day").toDate();

      // Total earnings (all-time)
      const totalEarning = await getEarningsForPeriod(new Date(0), new Date());
      
      // Earnings for today
      const todayEarning = await getEarningsForPeriod(today, endOfToday);

      // Earnings for last week
      const lastWeekStart = moment().subtract(1, "week").startOf("day").toDate();
      const lastWeekEnd = moment().subtract(1, "day").endOf("day").toDate(); // Up to yesterday
      const lastWeekEarning = await getEarningsForPeriod(lastWeekStart, lastWeekEnd);

      // Earnings for last month
      const lastMonthStart = moment().subtract(1, "month").startOf("day").toDate();
      const lastMonthEnd = moment().subtract(1, "day").endOf("day").toDate();
      const lastMonthEarning = await getEarningsForPeriod(lastMonthStart, lastMonthEnd);

      // Earnings for last year
      const lastYearStart = moment().subtract(1, "year").startOf("day").toDate();
      const lastYearEnd = moment().subtract(1, "day").endOf("day").toDate();
      const lastYearEarning = await getEarningsForPeriod(lastYearStart, lastYearEnd);

      let customEarning = 0;
      // Calculate custom earnings only if custom filter is selected
      if (filter === "custom" && startDate && endDate) {
        const customStart = moment(startDate, "YYYY-MM-DD").startOf("day").toDate();
        const customEnd = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();

        // Ensure valid custom date range
        if (customStart > customEnd) {
          throw new Error("Start date cannot be later than end date");
        }

        customEarning = await getEarningsForPeriod(customStart, customEnd);
      }

      return {
        totalEarning,
        lastWeekEarning,
        lastMonthEarning,
        lastYearEarning,
        todayEarning,
        customEarning: filter === "custom" && startDate && endDate ? customEarning : 0
      };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new EarningService();
