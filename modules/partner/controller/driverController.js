const driverService = require('../services/shared/driverService');

class DriverController {
    addDriver = async (req, res) => {
        try {
           
            const partnerId = req.user.id;
            
           
            const { firstName, lastName, phoneNumber , age} = req.body;

            
            const driver = await driverService.addDriver({ partnerId, firstName, lastName, phoneNumber,age});
            
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
    updateDrivers = async (req, res) => {
        try {
            const partnerId = req.user.id;              
            const driverId = req.params.driverId;       
            const updateData = req.body;
    
    
            const updatedDriver = await driverService.updateDriver({
                driverId,
                partnerId,
                updateData,
            });
    
            if (!updatedDriver) {
              
                return res.status(404).json({ message: "Driver not found or update failed" });
            }
    
            return res.status(200).json({ updatedDriver });
        } catch (error) {
            console.error("Update Error:", error.message);
            res.status(500).json({ message: error.message });
        }
    };
    
    deleteDriver = async (req, res) => {
        try {
            const partnerId = req.user.id;          
            const driverId = req.params.driverId;   
    
            const deletedDriver = await driverService.deleteDriver({ driverId, partnerId });
    
            if (!deletedDriver) {
                return res.status(404).json({ message: "Driver not found or already deleted" });
            }
    
            return res.status(200).json({ message: "Driver deleted successfully" });
        } catch (error) {
            console.error("Delete Error:", error.message);
            res.status(500).json({ message: error.message });
        }
    };
    
}

module.exports = new DriverController();
