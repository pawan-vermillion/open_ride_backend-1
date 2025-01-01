
const BodyStyle = require("../../admin/model/bodyStyle");
const SubModel = require("../../admin/model/subModel")

class GetCarService {
   


    async getCarBodyStyle() {
        try {
           
            const bodyStyles = await BodyStyle.find();
            if (!bodyStyles || bodyStyles.length === 0) {
                throw new Error("No body styles found");
            }

            const transformedBodystyle = bodyStyles.map(bodyStyle => ({
                bodyStyleId: bodyStyle._id,
                bodyStyle: bodyStyle.bodyStyle
            }))
            return transformedBodystyle;
        } catch (error) {
            throw new Error(`Error occurred while fetching body styles: ${error.message}. Stack trace: ${error.stack}`);
        }
    }

    async getAllSubModels(modelId) {
        try {
            const subModels = await SubModel.find({ modelId }).lean(); 
            if (!subModels || subModels.length === 0) {
                return []; 
            }
    
            // Transform the response
            const transformedSubModels = subModels.map(subModel => ({
                subModelId: subModel._id,
                modelId: subModel.modelId,
                subModel: subModel.subModel
            }));
    
            return transformedSubModels;
        } catch (error) {
            throw new Error(`Error occurred while fetching sub-models: ${error.message}`);
        }
    }
    
    
}

module.exports =  new GetCarService()
