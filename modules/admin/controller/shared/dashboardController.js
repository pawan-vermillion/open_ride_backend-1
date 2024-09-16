const DashboardService = require("../../services/shared/dashboardService")

class DahboardController {
    getDashboardCountController = async ( req,res)=> {
        try {
            const result  = await DashboardService.getDashboardCountDetails()
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new  DahboardController()