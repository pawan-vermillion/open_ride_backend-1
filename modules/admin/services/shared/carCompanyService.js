const CarCompany = require("../../model/carCompany");
const CarModel = require("../../model/carModel");
const BodyStyle = require("../../model/bodyStyle");
const SubModel = require("../../model/subModel")

class CarCompanyService {
    async createCarCompany(adminData){
        try {
             
            const create = await CarCompany.create(adminData)
            return{
                message:"Car Company Add Successfully",
            }
        } catch (error) {
            throw error;
        }
    }

    async getCarComapny({ adminId }) {
        try {
            const result = await CarCompany.aggregate([
                {
                    $match: { adminId: adminId } // Filter by adminId
                },
                {
                    $lookup: {
                        from: "carmodels", // Name of the CarModel collection
                        localField: "_id",
                        foreignField: "companyId",
                        as: "models"
                    }
                },
                {
                    $addFields: {
                        modelCount: { $size: "$models" } // Add modelCount field with the size of the models array
                    }
                },
                {
                    $project: {
                        __v: 0, // Exclude __v field if not needed
                        models: 0 // Exclude models array if not needed
                    }
                }
            ]).exec();

            return { Comapny: result };
        } catch (error) {
            throw error;
        }
    }

    async createCarModel({companyId,model}){
        try {
            const create  = await CarModel.create({companyId,model})
            return{
                message:"Car Model Add Successfully"
            }
        } catch (error) {
            throw error;
        }
    }
    async getCarModel({ companyId }){
        try {
          const result = await CarModel.find({companyId:companyId}).select('-__v')
          return result  
        } catch (error) {
           throw error 
        }
    }

    async createCarBodyStyle({ carData }) {
        try {
           
            if (!carData.bodyStyle) {
                throw new Error("bodyStyle is required");
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
            const create = await SubModel.create({ subModel, modelId });
            return {
                message: "SubModel Added Successfully"
            };
        } catch (error) {
            throw new Error(`Error occurred while adding SubModel: ${error.message}`);
        }
    }
}

module.exports =  new CarCompanyService()
