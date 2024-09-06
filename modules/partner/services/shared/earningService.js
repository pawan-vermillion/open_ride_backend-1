const CarBooking = require("../../../shared/model/booking");
const moment = require("moment");

class EarningService {
  earning = async ({ partnerId, filter, startDate, endDate }) => {
    try {
      const getEarningsForPeriod = async (start, end) => {
        
        
        const bookings = await CarBooking.find({
          "partnerId": partnerId,
          status: { $in: ["confirmed", "completed"] }
        });

       
        
        return bookings.reduce((sum, booking) => sum + booking.summary.partnerAmmount, 0);
      };

      const today = moment().startOf("day").toDate();
      const endOfToday = moment(today).endOf("day").toDate();

      const totalEarning = await getEarningsForPeriod(new Date(0), new Date());
      const todayEarning = await getEarningsForPeriod(today, endOfToday);
      
      const lastWeekStart = moment().subtract(1, "week").startOf("day").toDate();
      const lastWeekEnd = moment().endOf("day").toDate();
      const lastWeekEarning = await getEarningsForPeriod(lastWeekStart, lastWeekEnd);

      const lastMonthStart = moment().subtract(1, "month").startOf("day").toDate();
      const lastMonthEnd = moment().endOf("day").toDate();
      const lastMonthEarning = await getEarningsForPeriod(lastMonthStart, lastMonthEnd);

      const lastYearStart = moment().subtract(1, "year").startOf("day").toDate();
      const lastYearEnd = moment().endOf("day").toDate();
      const lastYearEarning = await getEarningsForPeriod(lastYearStart, lastYearEnd);

      let customEarning = 0;
      if (filter === "custom" && startDate && endDate) {
        if (!moment(startDate, "YYYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid()) {
          throw new Error("Invalid date format. Please provide valid dates in yyyy-MM-dd format.");
        }
        const customStart = moment(startDate, "YYYY-MM-DD").startOf("day").toDate();
        const customEnd = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();
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
