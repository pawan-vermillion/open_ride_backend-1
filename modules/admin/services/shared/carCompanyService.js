const CarCompany = require("../../model/carCompany");
const CarModel = require("../../model/carModel");
const BodyStyle = require("../../model/bodyStyle");
const SubModel = require("../../model/subModel");
const mongoose = require("mongoose")


class CarCompanyService {
    async createCarCompany(adminData) {
        try {

            const create = await CarCompany.create(adminData)
            return {
                message: "Car Company Add Successfully",
            }
        } catch (error) {
            throw error;
        }
    }

    async getCarCompany(adminId) {
        try {
            const result = await CarCompany.aggregate([
                {
                    $match: { adminId: new mongoose.Types.ObjectId(adminId) }
                },
                {
                    $lookup: {
                        from: "carmodels",  // Collection name should be in lowercase or match the exact name in your DB
                        localField: "_id",
                        foreignField: "companyId",
                        as: "models"
                    }
                },
                {
                    $unwind: "$models",
                    preserveNullAndEmptyArrays: true   // Deconstructs the array for further processing
                },
                {
                    $lookup: {
                        from: "submodels",  // Collection name should be in lowercase or match the exact name in your DB
                        localField: "models.subModels",
                        foreignField: "_id",
                        as: "models.subModels"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        companyName: { $first: "$companyName" },
                        models: { $push: "$models" }
                    }
                },
                {
                    $addFields: {
                        modelCount: { $size: "$models" }
                    }
                },
                {
                    $project: {
                        __v: 0,
                        "models.__v": 0
                    }
                }
            ]).exec();
    
            return { Company: result };
        } catch (error) {
            throw error;
        }
    }


    async createCarModel({ companyId, model }) {
        try {
            const create = await CarModel.create({ companyId, model })
            return {
                message: "Car Model Add Successfully"
            }
        } catch (error) {
            throw error;
        }
    }
    async getCarModel({ companyId }) {
        try {
            const company = await CarCompany.findOne({ _id: companyId });
            if (!company) {
                return {
                    message: "Company Not Found"
                };
            }
    
            const result = await CarModel.aggregate([
                {
                    $match: { companyId: new mongoose.Types.ObjectId(companyId) }
                },
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
                        __v: 0,
                       
                    }
                }
            ])
    
            return {
                companyName: company.carCompany,
                models: result
            };
        } catch (error) {
            throw error;
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

module.exports = new CarCompanyService()
