const CarBooking = require("../../../shared/model/booking");
const moment = require("moment");

class EarningService {
  earning = async ({ partnerId, filter, startDate, endDate }) => {
    try {
      // Initialize earnings
      let totalEarning = 0;
      let lastWeekEarning = 0;
      let lastMonthEarning = 0;
      let lastYearEarning = 0;
      let todayEarning = 0;
      let customEarning = 0;

      // Helper function to calculate earnings for any given period
      const calculateEarningForPeriod = async (start, end) => {
        console.log(`Calculating earnings from ${start} to ${end} for partnerId ${partnerId}`);
      
        // Validate the date range
        if (!start || !end || start > end) {
          console.error('Invalid date range provided.');
          return 0;
        }
      
        const earningsResult = await CarBooking.aggregate([
          { $match: {
              createdAt: { $gte: start, $lte: end },
              "summary.partnerId": partnerId,
              status: { $in: ["confirmed", "completed"] }
          }},
          { $project: {
              createdAt: 1,
              "summary.partnerId": 1,
              "summary.partnerAmmount": 1,
              status: 1
          }},
          { $group: {
              _id: null,
              totalEarnings: { $sum: "$summary.partnerAmmount" }
          }},
          { $project: {
              _id: 0,
              totalEarnings: 1
          }}
        ]);
      
        console.log(`Earnings result: ${JSON.stringify(earningsResult)}`);
      
        return earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;
      };
      
      
      
      

      // Calculate earnings for different periods
      const today = moment().startOf("day");
      todayEarning = await calculateEarningForPeriod(today.toDate(), moment(today).endOf("day").toDate());
      totalEarning = await calculateEarningForPeriod(new Date(0), new Date());
      const lastWeekStart = moment().subtract(1, "week").startOf("day").toDate();
      lastWeekEarning = await calculateEarningForPeriod(lastWeekStart, moment().endOf("day").toDate());
      const lastMonthStart = moment().subtract(1, "month").startOf("day").toDate();
      lastMonthEarning = await calculateEarningForPeriod(lastMonthStart, moment().endOf("day").toDate());
      const lastYearStart = moment().subtract(1, "year").startOf("day").toDate();
      lastYearEarning = await calculateEarningForPeriod(lastYearStart, moment().endOf("day").toDate());

      if (filter === "custom" && startDate && endDate) {
        if (!moment(startDate, "YYYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid()) {
          throw new Error("Invalid date format. Please provide valid dates in yyyy-MM-dd format.");
        }
        customEarning = await calculateEarningForPeriod(
          moment(startDate, "YYYY-MM-DD").startOf("day").toDate(),
          moment(endDate, "YYYY-MM-DD").endOf("day").toDate()
        );
      }

      return {
        totalEarning,
        lastWeekEarning,
        lastMonthEarning,
        lastYearEarning,
        todayEarning,
        customEarning,
      };
    } catch (error) {
      console.error("Error in earning calculation:", error.message);
      throw error;
    }
  };
}

module.exports = new EarningService();
