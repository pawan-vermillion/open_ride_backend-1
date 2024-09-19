const driverService = require('../services/shared/driverService');

class DriverController {
    addDriver = async (req, res) => {
        try {
           
            const partnerId = req.user.id;
            
           
            const { firstName, lastName, phoneNumber } = req.body;

            
            const driver = await driverService.addDriver({ partnerId, firstName, lastName, phoneNumber });
            
            res.status(201).json(driver);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    };

    getDriversByPartner = async (req, res) => {
        try {
            const partnerId = req.user.id;  
            const { limit, page } = req.query;
            const drivers = await driverService.getDriversByPartnerId({partnerId , limit , page});
            res.status(200).json(drivers);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    };
}

module.exports = new DriverController();
