const CarDetails = require("../../../partner/model/car");
const mongoose = require("mongoose");

class AdminCarService {
  async getAllCarsService({ search, page, limit }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
  
      const searchQuery = search
        ? {
            $and: [
              {
                $or: [
                  { carNumber: { $regex: search, $options: "i" } },
                  { companyName: { $regex: search, $options: "i" } },
                  { modelName: { $regex: search, $options: "i" } },
                ],
              },
              { isDelete: false },
            ],
          }
        : { isDelete: false };
  
      // Get the total count of cars matching the search query (for pagination)
      const totalCount = await CarDetails.countDocuments(searchQuery);
  
      // Get the cars data with pagination
      const cars = await CarDetails.find(searchQuery)
        .select(
          "_id companyName modelName subModel modelYear bodyStyle isCarVarified rating numberOfSeat fuelType exteriorImage transmission ownerFullName isDelete"
        )
        .populate("companyName", "carCompany -_id logoImage")
        .populate("modelName", "model -_id")
        .populate("subModel", "subModel -_id")
        .populate("bodyStyle", "bodyStyle -_id")
        .skip(skip)
        .limit(pageSize);
  
      const formattedCars = cars.map((car) => ({
        carId: car._id,
        carCompany: car.companyName?.carCompany || "",
        carModel: car.modelName?.model || "",
        carSubModel: car.subModel?.subModel || "",
        modelYear: car.modelYear,
        bodyStyle: car.bodyStyle?.bodyStyle || "",
        isCarVerified: car.isCarVarified,
        rating: car.rating,
        noOfSeat: car.numberOfSeat,
        fuelType: car.fuelType,
        exteriorImage: car.exteriorImage?.[0] || "",
        transmission: car?.transmission || "",
        ownerName: car?.ownerFullName || "",
        companyLogo: car?.companyName?.logoImage || "",
        isDelete: car.isDelete,
      }));
  
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / pageSize);
  
      return {
        currentPage,
        totalPages,
        totalCount,
        pageSize,
        cars: formattedCars,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while fetching car data.");
    }
  }
  


  async getAllCarsServicePartner({ search, page, limit, partnerId }) {
    try {
      const pageSize = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
      const skip = (currentPage - 1) * pageSize;
  
      // Search query to filter cars based on partnerId and optional search term
      const searchQuery = {
        partnerId,  // Add partnerId condition here to only fetch cars of the current partner
        isDelete: false,  // Ensure cars are not marked as deleted
        ...(search && {
          $or: [
            { carNumber: { $regex: search, $options: "i" } },
            { companyName: { $regex: search, $options: "i" } },
            { modelName: { $regex: search, $options: "i" } },
          ],
        }),
      };
  
      // Fetch cars with the search conditions applied
      const cars = await CarDetails.find(searchQuery)
        .select(
          "_id companyName modelName subModel modelYear bodyStyle isCarVarified rating numberOfSeat fuelType exteriorImage transmission ownerFullName isDelete"
        )
        .populate("companyName", "carCompany -_id logoImage")
        .populate("modelName", "model -_id")
        .populate("subModel", "subModel -_id")
        .populate("bodyStyle", "bodyStyle -_id")
        .skip(skip)
        .limit(pageSize);
  
      const formattedCars = cars.map((car) => ({
        carId: car._id,
        carCompany: car.companyName?.carCompany || "",
        carModel: car.modelName?.model || "",
        carSubModel: car.subModel?.subModel || "",
        modelYear: car.modelYear,
        bodyStyle: car.bodyStyle?.bodyStyle || "",
        isCarVerified: car.isCarVarified,
        rating: car.rating,
        noOfSeat: car.numberOfSeat,
        fuelType: car.fuelType,
        exteriorImage: car.exteriorImage?.[0] || "",
        transmission: car?.transmission || "",
        ownerName: car?.ownerFullName || "",
        companyLogo: car?.companyName?.logoImage || "",
        isDelete: car.isDelete,
      }));
  
      return formattedCars;
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while fetching car data.");
    }
  }
  

  async getCarByIdService({ carId }) {
    try {
      const car = await CarDetails.findOne({ 
        _id: carId,
        isDelete: false 
      })
        .populate(
          "partnerId",
          "emailAddress phoneNumber firstName lastName profileImage  "
        )
        .populate("companyName", "carCompany")
        .populate("bodyStyle", "bodyStyle")
        .populate("subModel", "subModel")
        .populate("modelName", "model")
        .select("-createdAt -updatedAt -__v");

      if (!car) {
        throw new Error("Car not found.");
      }

      // Retrieve the ratings data from reviews
      const reviews = await mongoose.model("CarReview").find({ carId });

      // Initialize rating counts
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      // Count the number of reviews for each rating
      reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingCounts[review.rating]++;
        }
      });

      // Map the numeric ratings to string keys for the response
      const ratingCountsString = {
        one: ratingCounts[1],
        two: ratingCounts[2],
        three: ratingCounts[3],
        four: ratingCounts[4],
        five: ratingCounts[5],
        totalCount: Object.values(ratingCounts).reduce(
          (acc, count) => acc + count,
          0
        ), // Add the total count
      };

      // Calculate the average rating
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
          : 0;

      // Prepare the response with rating counts and average rating
      const { companyName, bodyStyle, subModel, modelName, ...carData } =
        car.toObject();

      return {
        ...carData,
        companyName: companyName ? companyName.carCompany : "N/A",
        carCompanyId: companyName ? companyName._id : "N/A",
        modelName: modelName ? modelName.model : "N/A",
        modelId: modelName ? modelName._id : "N/A",
        subModel: subModel ? subModel.subModel : "N/A",
        subModelId: subModel ? subModel._id : "N/A",
        bodyStyle: bodyStyle ? bodyStyle.bodyStyle : "N/A",
        bodyStyleId: bodyStyle ? bodyStyle._id : "N/A",
        modelYear: car.modelYear,
        rating: averageRating,
        ratingCounts: ratingCountsString, // Send the string keys in the response
        exteriorImage: car.exteriorImage || "",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error occurred while fetching car data by ID.");
    }
  }
}

module.exports = new AdminCarService();
