const RepairCar = require("../../model/repairCar");
const CarDetails = require("../../model/car")
const moment = require("moment");
const Partner = require("../../model/partner");
const carCompany = require("../../../admin/model/carCompany");
class RepaircarService {
    async repairCar({ partnerId, repairDetails }) {
        try {
            const carExists = await CarDetails.findById(repairDetails.carId);
            if (!carExists) {
                throw new Error("Car not found. Please provide a valid carId.");
            }
    
            const currentDate = new Date();
            const fromtoDate = new Date(repairDetails.fromtoDate);
            const fromtoTime = repairDetails.fromtoTime.split(':');
            const toDate = new Date(repairDetails.toDate);
            const toTime = repairDetails.toTime.split(':');
    
           
            fromtoDate.setHours(parseInt(fromtoTime[0]), parseInt(fromtoTime[1]));
            toDate.setHours(parseInt(toTime[0]), parseInt(toTime[1]));
    
            console.log(repairDetails, fromtoTime, toTime);
    
           
            if (fromtoDate < currentDate || toDate < currentDate) {
                throw new Error("Dates cannot be in the past. Please select valid dates.");
            }
    
           
            if (fromtoDate.getDate() === toDate.getDate()) {
                if (fromtoDate.getHours() === toDate.getHours() && fromtoDate.getMinutes() >= toDate.getMinutes()) {
                    throw new Error("From time must be earlier than To time on the same date.");
                } else if (fromtoDate.getHours() > toDate.getHours()) {
                    throw new Error("From time must be earlier than To time on the same date.");
                }
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
            console.log('Error in RepaircarService:', error.message);
            throw error;
        }
    }
    
    
    async getAllRepairCars({ page, limit,partnerId }) {
        try {

            const pageNumber = parseInt(page) || 1;
            const pageSize = parseInt(limit) || 10;
            const skip = (pageNumber - 1) * pageSize;


            const repairCars = await RepairCar.find({partnerId})
            .skip(skip)
            .select('-__v -_id -createdAt -updatedAt -partnerId ')
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .populate({
                path: 'carId',
                select: 'companyName modelName subModel bodyStyle modelYear rating -_id exteriorImage',
                populate: [
                    {
                        path: 'companyName',
                        select: 'carCompany',  // Assuming the company name is stored in a company collection and has a 'name' field
                    },
                    {
                        path: 'modelName',
                        select: 'model',  // Assuming the model name is stored in a model collection and has a 'name' field
                    },
                    {
                        path: 'subModel',
                        select: 'subModel',  // Assuming the sub-model name is stored in a sub-model collection and has a 'name' field
                    },
                    {
                        path: 'bodyStyle',
                        select: 'bodyStyle',  // Assuming the body style is stored in a body style collection and has a 'name' field
                    }
                ]
            });

        // Format the repair cars and remove the carId object, replacing it with its properties
        const formattedRepairCars = repairCars.map(car => {
            const { carId, ...carData } = car.toObject();

          

            return {
                ...carData,
                companyName: carId?.companyName?.carCompany ? carId.companyName?.carCompany : 'N/A',
                modelName: carId?.modelName?.model ? carId.modelName?.model : 'N/A',
                subModel: carId?.subModel?.subModel ? carId.subModel?.subModel : 'N/A',
                bodyStyle: carId?.bodyStyle?.bodyStyle ? carId.bodyStyle?.bodyStyle : 'N/A',
                modelYear: carId?.modelYear,
                rating: carId?.rating,
                fromtoDate: moment(car?.fromtoDate).format('YYYY-MM-DD'),  // Format the date as per your requirement
                toDate: moment(car?.toDate).format('YYYY-MM-DD'),          // Format the date as per your requirement
                fromtoTime: car?.fromtoTime,
                toTime: car?.toTime,
                exteriorImage:carId?.exteriorImage[0] || ""
            };
        });

        return formattedRepairCars;
        } catch (error) {
            console.error("Error in RepaircarService:", error.message);
            throw error;
        }
    }


    async getCarList(partnerId) {
        try {
          // Check if the partner exists
          const checkPartner = await Partner.findById(partnerId);
          if (!checkPartner) {
            throw new Error("Partner not found");
          }
      
          // Fetch the cars for the partner and populate the related carCompany
          const fetchCar = await CarDetails.find({ partnerId: partnerId })
            .populate(
                {
                    path: 'companyName',
                    select: 'carCompany',
                }
            ) // Populate carCompany from the referenced companyName
            .select("carNumber")  // Select only carCompany from the populated companyName and carNumber
      
          if (!fetchCar || fetchCar.length === 0) {
            throw new Error("No cars found for this partner");
          }

    
          // Format the response to only include the carCompany and carNumber
          const formattedResponse = fetchCar.map(car => ({
            car: `${car.companyName?.carCompany || "N/A"} - ${car.carNumber}`, 
            carId: car._id,
          }));
      
          return formattedResponse; // Return the formatted list of cars
        } catch (error) {
          console.error("Error in getCarList:", error.message);
          throw error; // Throw the error to be handled by the caller
        }
      }
      
}

module.exports = new RepaircarService();
