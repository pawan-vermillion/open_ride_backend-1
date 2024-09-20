    const CarCompany = require("../../model/carCompany");
    const CarModel = require("../../model/carModel");
    const BodyStyle = require("../../model/bodyStyle");
    const SubModel = require("../../model/subModel");
    const mongoose = require("mongoose")


    class CarCompanyService {
        async createCarCompany({ carCompanyData }) {
            try {
                // Ensure logoImage is assigned correctly
                const create = await CarCompany.create({
                    carCompany: carCompanyData.carCompany,
                    logoImage: carCompanyData.logoImage, // Use the correct field name here
                });
                return {
                    message: "Car Company Added Successfully",
                    logo: carCompanyData.logoImage,
                };
            } catch (error) {
                if (error.code === 11000) {
                    throw new Error("Car Company already exists");
                } else {
                    console.error("Database Error:", error); // Log the error for debugging
                    throw new Error("Car Company can't be added");
                }
            }
        }
        
        async getCarCompany() {
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
