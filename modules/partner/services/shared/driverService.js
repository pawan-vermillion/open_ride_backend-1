
const Driver = require('../../model/driver');

class DriverService {
    addDriver = async ({ partnerId, firstName, lastName, phoneNumber, age, driverImage }) => {
        try {
            const newDriver = await Driver.create({
                partnerId,
                firstName,
                lastName,
                phoneNumber,
                age,
               driverImage 
            });
    
            const formattedDriver = {
                ...newDriver.toObject(),
                driverId: newDriver._id,
            };
            delete formattedDriver._id;
    
            return formattedDriver;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    
    

    getDriversByPartnerId = async ({ partnerId, limit, page }) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
    
            const total = await Driver.countDocuments({ partnerId }); 
            const drivers = await Driver.find({ partnerId })
                .skip(skip)
                .limit(pageSize);
    
            
            const formattedDrivers = drivers.map((driver) => {
                const driverObj = driver.toObject();
                const { _id,createdAt , updatedAt , __v,driverImage, ...rest } = driverObj; 
                return {
                    ...rest,
                    driverImage:driverImage || "",
                    driverId: _id,  
                };
            });
    
            return formattedDrivers
         
        } catch (error) {
            throw error;
        }
    };
    
    

    updateDriver = async ({ driverId, partnerId, updateData }) => {
        try {
            if (updateData.phoneNumber) {
                const { phoneNumber } = updateData;
                
               
                const checkPhone = await Driver.findOne({
                    partnerId: partnerId,
                    phoneNumber: phoneNumber
                });
    
                
                if (checkPhone) {
                    throw new Error("This phone number is already registered with the same partner. A partner cannot add the same phone number for a driver more than once.");
                }
            }
            const updatedDriver = await Driver.findOneAndUpdate(
                { _id: driverId, partnerId }, 
                updateData,                 
                { new: true } 
            );
            return updatedDriver;
        } catch (error) {
            console.error("Error updating driver:", error.message);
            throw error;
        }
    };
    deleteDriver = async ({ driverId, partnerId }) => {
        try {
            const deletedDriver = await Driver.findOneAndDelete({
                _id: driverId,
                partnerId,
            });
            return deletedDriver;
        } catch (error) {
            console.error("Error deleting driver:", error.message);
            throw error;
        }
    };
    
    
}

module.exports = new DriverService();
