const moment = require('moment');
const EarningService = require("../services/shared/earningService");

class EarningController {
    earningFilter = async (req, res) => {
        try {
            const { filter, startDate, endDate } = req.query;
            const partnerId = req.user.id;  
    
            if (!partnerId) {
                return res.status(400).json({ message: "Partner ID is required" });
            }
    
            if (filter === "custom") {
                const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
                    return res.status(400).json({ message: "Invalid date format. Please use yyyy-MM-dd format." });
                }
    
                if (!moment(startDate, "YYYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid()) {
                    return res.status(400).json({
                        message: "Invalid date. Please provide valid dates in yyyy-MM-dd format."
                    });
                }
            }
    
            const earnings = await EarningService.earning({ partnerId, filter, startDate, endDate });
    
            res.status(200).json({ earnings });
    
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = new EarningController();