
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
          // Retrieve the existing driver data to check the current phone number
          const existingDriver = await Driver.findOne({ _id: driverId, partnerId });
      
          if (!existingDriver) {
            throw new Error("Driver not found");
          }
      
          // Check if the phone number is being updated
          if (updateData.phoneNumber && updateData.phoneNumber !== existingDriver.phoneNumber) {
            const { phoneNumber } = updateData;
      
            // Check if the new phone number already exists for the same partner
            const checkPhone = await Driver.findOne({
              partnerId: partnerId,
              phoneNumber: phoneNumber
            });
        
            // If the phone number is already registered, throw an error
            if (checkPhone && checkPhone._id.toString() !== existingDriver._id.toString()) {
              throw new Error("This phone number is already registered with the same partner. A partner cannot add the same phone number for a driver more than once.");
            }
          }
      
          // Proceed with the update (including other fields like name, etc.)
          const updatedDriver = await Driver.findOneAndUpdate(
            { _id: driverId, partnerId },
            updateData,                
            { new: true }  // Return the updated driver
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
