const CarCompany = require("../../model/carCompany");
const CarModel = require("../../model/carModel");
const BodyStyle = require("../../model/bodyStyle");
const SubModel = require("../../model/subModel");
const mongoose = require("mongoose")


class CarCompanyService {
    async createCarCompany({ carCompanyData }) {
        try {

            const create = await CarCompany.create({
                carCompany: carCompanyData.carCompany,
                logoImage: carCompanyData.logoImage,
            });
            return {
                message: "Car Company Added Successfully",
                logo: carCompanyData.logoImage,
            };
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("Car Company already exists");
            } else {

                throw new Error("Car Company can't be added");
            }
        }
    }
    async getCarCompany(adminId, search) {
        try {
          const pipeline = [
            {
              $lookup: {
                from: "carmodels",
                localField: "_id",
                foreignField: "companyId",
                as: "models"
              }
            },
            {
              $addFields: {
                modelCount: { $size: "$models" }
              }
            },
           
            ...(search
              ? [
                  {
                    $match: {
                      carCompany: { $regex: search, $options: "i" }
                    }
                  }
                ]
              : []),
            {
              $project: {
                carCompany: 1,
                logoImage: 1,
                modelCount: 1
              }
            }
          ];
      
          const result = await CarCompany.aggregate(pipeline).exec();
          return result;
        } catch (error) {
          throw error;
        }
      }
      

    async createCarModel({ companyId, model }) {
        try {
            const carCompany = await CarCompany.findById(companyId);
        if (!carCompany) {
            throw new Error("Company Not Found");
        }
            const existingModel = await CarModel.findOne({ model });

            if (existingModel) {
                throw new Error("Car Model already exists");
            }

            const create = await CarModel.create({ companyId, model });

            return {
                message: "Car Model Added Successfully",
            };
        } catch (error) {
            console.log(error)
            throw error;
        }
    }



    async getCarModel({ companyId, search }) {
        try {
            const company = await CarCompany.findOne({ _id: companyId });
            if (!company) {
                return { message: "Company Not Found" };
            }

            // Search condition setup
            let searchCondition = { companyId: new mongoose.Types.ObjectId(companyId) };

            if (search) {
                searchCondition['model'] = { $regex: search, $options: "i" };
            }


            const result = await CarModel.aggregate([
                { $match: searchCondition },
                {
                    $lookup: {
                        from: "submodels",
                        localField: "_id",
                        foreignField: "modelId",
                        as: "subModels"
                    }
                },
                {
                    $addFields: {
                        subModelCount: { $size: "$subModels" }
                    }
                },
                {
                    $project: {
                        __v: 0
                    }
                }
            ]);

            return {
                companyName: company.carCompany,
                models: result
            };
        } catch (error) {
            console.error("Error in getCarModel:", error);
            
            throw error;
        }
    }




    async createCarBodyStyle({ carData }) {
        try {
            if (!carData.bodyStyle) {
                throw new Error("bodyStyle is required");
            }

            const existingBodyStyle = await BodyStyle.findOne({ bodyStyle: carData.bodyStyle });

            if (existingBodyStyle) {
                return {
                    statusCode: 400,
                    message: "Body Style already exists"
                };
            }

            const create = await BodyStyle.create(carData);

            return {
                message: "Car Body Style Added Successfully"
            };
        } catch (error) {
            throw error;
        }
    }



    async createSubModel({ subModel, modelId }) {
        try {
       
            const submodel = await CarModel.findById(modelId);
            if (!submodel) {
                return {
                   
                    message: "Model Not Found"
                };
            }
    
        
            const existingSubModel = await SubModel.findOne({ subModel, modelId });
            if (existingSubModel) {
                return {
               
                    message: "SubModel already exists"
                };
            }
    
         
            await SubModel.create({ subModel, modelId });
            return {
                
                message: "SubModel Added Successfully"
            };
        } catch (error) {
            
            return {
                status: 500,
                message: `Unexpected Error: ${error.message}`
            };
        }
    }
    


}

module.exports = new CarCompanyService()
