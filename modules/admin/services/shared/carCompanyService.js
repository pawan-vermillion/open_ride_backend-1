const CarCompany = require("../../model/carCompany");
const CarModel = require("../../model/carModel");
const BodyStyle = require("../../model/bodyStyle");
const SubModel = require("../../model/subModel");
const mongoose = require("mongoose")


class CarCompanyService {
    async createCarCompany({ carCompanyData }) {
        try {

            const isCarExists = await CarCompany.findOne({ name: carCompanyData.carCompany });
            if (isCarExists) {
                return { message: "Car Company already exists" }
            }

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
                carCompanyId: "$_id", 
                _id: 0,
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
                        carModelId: "$_id",
                        subModelCount: { $size: "$subModels" }
                    }
                },
                {
                    $project: {
                        _id: 0,
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

            throw new Error("Car Body Style Added Successfully")
        } catch (error) {
            throw error;
        }
    }



    async createSubModel({ subModel, modelId }) {
        try {
       
            const submodel = await CarModel.findById(modelId);
            if (!submodel) {
               throw new Error("Model Not Found");
            }
    
        
            const existingSubModel = await SubModel.findOne({ subModel, modelId });
            if (existingSubModel) {
                throw new Error("SubModel already exists")
            }
    
         
            await SubModel.create({ subModel, modelId });
           return ("SubModel Added Successfully")
        } catch (error) {
            
            throw new Error(error.message);
        }
    }
    


}

module.exports = new CarCompanyService()
