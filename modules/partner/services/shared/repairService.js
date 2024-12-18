const RepairCar = require("../../model/repairCar");
const CarDetails = require("../../model/car")
const moment = require("moment")
class RepaircarService {
    async repairCar({ partnerId, repairDetails }) {
        try {
            const carExists = await CarDetails.findById(repairDetails.carId);
            if (!carExists) {
                throw new Error("Car not found. Please provide a valid carId.");
            }
            const curentDate = new Date();
            const fromtoDate = new Date(repairDetails.fromtoDate);
            const toDate = new Date(repairDetails.toDate);

            if (fromtoDate < curentDate || toDate < curentDate) {
                throw new Error("Dates cannot be in the past. Please select valid dates.");
            }

            if (fromtoDate > toDate) {
                throw new Error("From date cannot be after the to date.");
            }
            const newRepairCar = new RepairCar({
                partnerId,
                carId: repairDetails.carId,
                fromtoDate: repairDetails.fromtoDate,
                fromtoTime: repairDetails.fromtoTime,
                toDate: repairDetails.toDate,
                toTime: repairDetails.toTime,
            });


            await newRepairCar.save();
            return newRepairCar;
        } catch (error) {
            console.log('Error in RepaircarService:', error);
            throw error;
        }
    }
    async getAllRepairCars({ page, limit }) {
        try {

            const pageNumber = parseInt(page) || 1;
            const pageSize = parseInt(limit) || 10;
            const skip = (pageNumber - 1) * pageSize;


            const repairCars = await RepairCar.find()
                .skip(skip)
                .limit(pageSize)
                .sort({ createdAt: -1 });

                const formattedRepairCars = repairCars.map(car => {
                    return {
                        ...car.toObject(),
                        fromtoDate: moment(car.fromtoDate).format('YYYY-MM-DD'),  // Format the date as per your requirement
                        toDate: moment(car.toDate).format('YYYY-MM-DD'),          // Format the date as per your requirement
                    };
                });
            const totalRecords = await RepairCar.countDocuments();

            return {
                repairCars :formattedRepairCars,
                pagination: {
                    totalRecords,
                    totalPages: Math.ceil(totalRecords / pageSize),
                    currentPage: pageNumber,
                    pageSize,
                },
            };
        } catch (error) {
            console.error("Error in RepaircarService:", error.message);
            throw error;
        }
    }
}

module.exports = new RepaircarService();
