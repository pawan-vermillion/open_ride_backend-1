
const Driver = require('../../model/driver');

class DriverService {
    addDriver = async ({ partnerId, firstName, lastName, phoneNumber,age }) => {
        try {
           
            const newDriver = await Driver.create({
                partnerId,
                firstName,
                lastName,
                phoneNumber,
                age
            });
            return {
                message: "Driver added successfully",
                driver: newDriver
            };
        } catch (error) {
            throw error;
        }
    };

    getDriversByPartnerId = async ({partnerId , limit , page}) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
            const total = await Driver.countDocuments()
            const drivers = await Driver.find({ partnerId }).skip(skip).limit(pageSize)
            return {
                page:currentPage,
                limit:pageSize,
                totalPartner:total,
                drivers
            };
        } catch (error) {
            throw error;
        }
    };

    updateDriver = async ({ driverId, partnerId, updateData }) => {
        try {
            const updatedDriver = await Driver.findOneAndUpdate(
                { _id: driverId, partnerId }, 
                updateData,                 
                { new: true } // Ensure validation runs
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
