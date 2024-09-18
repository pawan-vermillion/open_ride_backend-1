const DashboardService = require("../../services/shared/dashboardService");

class DashboardController {
    getDashboardCountController = async (req, res) => {
        try {
            const { filter, startDate, endDate } = req.query;
            const result = await DashboardService.getDashboardCountDetails({
                filter,
                startDate,
                endDate,
            });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = new DashboardController();
