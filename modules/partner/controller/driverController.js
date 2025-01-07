const driverService = require('../services/shared/driverService');
const {uploadToCloudinary} = require("../../shared/config/multer");
const Driver = require('../model/driver');
class DriverController {
    addDriver = async (req, res) => {
        try {
            const partnerId = req.user.id;
            const { firstName, lastName, phoneNumber, age } = req.body;

            const checkPhone = await Driver.findOne({partnerId:partnerId , phoneNumber:phoneNumber})
            if (checkPhone) {
                throw new Error("This phone number is already registered with the same partner. A partner cannot add the same phone number for a driver more than once.");
              }
            const driverImage = req.file ? await uploadToCloudinary(req, req.file.path, 'driverImage') : null;


            
            const driver = await driverService.addDriver({ partnerId, firstName, lastName, phoneNumber, age, driverImage });
            
            res.status(201).json(driver);
        } catch (error) {
            console.error(error.message);
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
    
            if (req.file) {
              
                updateData.driverImage = req.file.path;  
            }
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
