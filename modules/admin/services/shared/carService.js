const CarDetails = require("../../../partner/model/car")

class AdminCarService {
 

  async getAllCarsService({ search, page, limit }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
  
      const searchQuery = search
        ? {
            $or: [
              { carNumber: { $regex: search, $options: "i" } },
              { companyName: { $regex: search, $options: "i" } },
              { modelName: { $regex: search, $options: "i" } },
            ],
          }
        : {};
  
    
      const cars = await CarDetails.find(searchQuery)
        .select(
          "_id companyName modelName subModel modelYear bodyStyle isCarVarified rating numberOfSeat fuelType exteriorImage transmission"
        )
        .populate("companyName", "carCompany -_id") 
        .populate("modelName", "model -_id") 
        .populate("subModel", "subModel -_id") 
        .populate("bodyStyle", "bodyStyle -_id")
        .skip(skip)
        .limit(pageSize);
  
      // Map the results to the desired structure
      const formattedCars = cars.map(car => ({
        carId: car._id,
        carCompany: car.companyName,
        carModel: car.modelName,
        carSubModel: car.subModel,
        modelYear: car.modelYear,
        bodyStyle: car.bodyStyle,
        isCarVerified: car.isCarVarified,
        rating: car.rating,
        noOfSeat: car.numberOfSeat,
        fuelType: car.fuelType,
        exteriorImage: car.exteriorImage?.[0] || "",
        transmission : car.transmission
      }));
  
      return formattedCars;
  
    } catch (error) {
      console.log(error)
      throw new Error("Error occurred while fetching car data.");
    }
  }
  
  
  async getCarByIdService({carId}) {
    try {
      
      
      const car = await CarDetails.findById(carId) .populate("partnerId", 'emailAddress phoneNumber firstName lastName profileImage')
      if (!car) {
        throw new Error("Car not found.");
      }
      return car;
    } catch (error) {
     
      throw new Error("Error occurred while fetching car data by ID.");
    }
  }
 


}

module.exports = new AdminCarService()