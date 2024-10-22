const GetCarService = require("../Service/carService")

class GetCarController {
    getCarBodyStyles = async (req, res) => {
        try {
            const bodyStyles = await GetCarService.getCarBodyStyle();
            res.status(200).json(bodyStyles);
        } catch (error) {
           
            if (error.code && error.code === 11000) {
                
                res.status(400).json({
                    message: "Duplicate key error: A body style with this data already exists.",
                    detail: error.message,
                });
            } else {
                res.status(500).json({ message: `An unexpected error occurred: ${error.message}` });
            }
        }
    }
    getSubModels = async (req, res) => {
        try {
            const { modelId } = req.params;
            const subModels = await GetCarService.getAllSubModels(modelId);
            
            if (subModels.length === 0) {
                return res.status(200).json({ message: "No sub-models found for the given model ID" });
            }
            
            res.status(200).json(subModels);
        } catch (error) {
            if (error.code && error.code === 11000) {
                res.status(400).json({
                    message: "Duplicate key error: A sub-model with this data already exists.",
                    detail: error.message,
                });
            } else {
                res.status(500).json({ message: `An unexpected error occurred: ${error.message}` });
            }
        }
    };
    
}

module.exports = new GetCarController()