const RepaircarService = require("../services/shared/repairService");

class RepairCarController {
    repairCar = async (req, res) => {
        try {
            const partnerId = req.user.id; 
            const repairDetails = req.body; 

      
            const newRepairCar = await RepaircarService.repairCar({
                partnerId,
                repairDetails,
            });

            return res.status(201).json({
                message: "Repair car record created successfully",
                repairCar: newRepairCar,
            });
        } catch (error) {
            console.error('Error in RepairCarController:', error);
            res.status(500).json({
                message: "Failed to create repair car record",
                error: error.message,
            });
        }
    };
    getAllRepairCars = async (req, res) => {
        try {
            const { page, limit } = req.query; 

            const result = await RepaircarService.getAllRepairCars({ page, limit });

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in RepairCarController:", error.message);
            res.status(500).json({
                message: "Failed to fetch repair car records",
                error: error.message,
            });
        }
    };


    getCarList = async (req, res) => {
        try {
            const partnerId = req.user.id; 

            const result = await RepaircarService.getCarList(partnerId );

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in RepairCarController:", error.message);
            res.status(500).json({
                message: "Failed to fetch repair car records",
                error: error.message,
            });
        }
    };
}

module.exports = new RepairCarController();
