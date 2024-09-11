
const BodyStyle = require("../../admin/model/bodyStyle");
const SubModel = require("../../admin/model/subModel")

class GetCarService {
   


    async getCarBodyStyle() {
        try {
           
            const bodyStyles = await BodyStyle.find();
            if (!bodyStyles || bodyStyles.length === 0) {
                throw new Error("No body styles found");
            }
            return bodyStyles;
        } catch (error) {
            throw new Error(`Error occurred while fetching body styles: ${error.message}. Stack trace: ${error.stack}`);
        }
    }

    async getAllSubModels(modelId) {
        try {
            const subModels = await SubModel.find({ modelId });
            if (!subModels || subModels.length === 0) {
                return []; // Return an empty array instead of throwing an error
            }
            return subModels;
        } catch (error) {
            throw new Error(`Error occurred while fetching sub-models: ${error.message}`);
        }
    }
    
}

module.exports =  new GetCarService()
