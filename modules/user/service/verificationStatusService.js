const CarDetails = require("../../partner/model/car");

class CarVerificationService {
  
    getVerifiedCar = async ({ limit, page, search }) => {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
    
            const searchQuery = search
                ? {
                      $or: [
                          { city: { $regex: search, $options: "i" } },
                          { companyName: { $regex: search, $options: "i" } },
                          { modelName: { $regex: search, $options: "i" } },
                      ],
                  }
                : {};
    
            const query = {
                ...searchQuery,
                isCarVarified: true 
            };
            
            const allCar = await CarDetails.find(query)
                .skip(skip)
                .limit(pageSize)
                .exec();
    
            const total = await CarDetails.countDocuments(query);
    
            return {
               
                page: currentPage,
                limit: pageSize,
                total,
                allCar
            };
        } catch (error) {
           
            throw error;
        }
    };
    
    
}

module.exports = new CarVerificationService();
