
const Driver = require('../../model/driver');

class DriverService {
    addDriver = async ({ partnerId, firstName, lastName, phoneNumber }) => {
        try {
           
            const newDriver = await Driver.create({
                partnerId,
                firstName,
                lastName,
                phoneNumber
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

}

module.exports = new DriverService();
