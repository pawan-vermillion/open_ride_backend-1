const CarVerificationService = require("../../services/shared/carVerificationService")

class CarVarificationController {
    changeCarVerificationStatus = async (req,res) => {
        try {
            const {carId} = req.params;
            const {statusValue} = req.body;
            if (!statusValue || !["verified", "unverified"].includes(statusValue)) {
                return res.status(400).json({
                  message:
                    "Invalid status parameter. Allowed values are 'verified' or 'unverified'",
                });
              }
              const { status, message, car } = await CarVerificationService.changeCarVeificationStatus(
                carId,
                statusValue
              );
        
              res.status(status).json({ message, car });
        } catch (error) {
           
            res.status(500).json({ message: "An error occurred while verification" });
        }
    }
    getUnverifiedAllCar = async (req,res) => {
        const {search, page , limit , filter} = req.query
        if( !filter || !["all" , "verified" , "unverified" ].includes(filter)){
            return res.status(400).json({
                message:
                  "Invalid filter parameter. Allowed values are 'all', 'verified', or 'unverified'.",
              });
        }
        try {
            const { status, message, allCar, total } = await CarVerificationService.getUnverifiedAllCar(
                {limit,
                page,
                search,
                filter}
              );
              res.status(status).json({ message, total, page , limit, allCar });
        } catch (error) {
            
            res
              .status(500)
              .json({ message: "An error occurred while fetching the Car" });
        }
    }
}

module.exports = new  CarVarificationController();
