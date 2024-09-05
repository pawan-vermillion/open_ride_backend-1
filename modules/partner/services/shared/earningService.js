const CarBooking = require("../../../shared/model/booking");
const moment = require("moment");

class EarningService {
  earning = async ({ filter, startDate, endDate }) => {
    try {
      let query = {};

      if (!filter) {
        filter = "today";
      }

      if (filter == "today") {
        const today = moment().startOf("day");
        query.createdAt = {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        };
      } else if (filter === "lastWeek") {
        const lastWeek = moment().subtract(1, "week").startOf("day");
        query.createdAt = {
          $gte: lastWeek.toDate(),
          $lte: moment().endOf("day").toDate(),
        };
      } else if (filter === "lastMonth") {
        const lastMonth = moment().subtract(1, "month").startOf("day");
        query.createdAt = {
          $gte: lastMonth.toDate(),
          $lte: moment().endOf("day").toDate(),
        };
      } else if (filter === "lastYear") {
        const lastYear = moment().subtract(1, "year").startOf("day");
        query.createdAt = {
          $gte: lastYear.toDate(),
          $lte: moment().endOf("day").toDate(),
        };
      } else if (filter === "custom") {
        if (!startDate || !endDate) {
          throw new Error(
            "Start date and end date are required for custom date filter"
          );
        }
        query.createdAt = {
          $gte: moment(startDate, "YYYY-MM-DD").startOf("day").toDate(),
          $lte: moment(endDate, "YYYY-MM-DD").endOf("day").toDate(),
        };
      }
      
     
      const result = await CarBooking.aggregate([
        { $match: {
            ...query,
            status: { $in: ["confirmed", "completed"] }
        }},
        { $group: {
            _id: null,
            totalEarnings: { $sum: "$summary.partnerAmmount" }
        }}
    ]);

    return result.length ? result[0].totalEarnings : 0;
     
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new EarningService();
