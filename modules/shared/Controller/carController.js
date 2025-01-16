const BodyStyle = require("../../admin/model/bodyStyle");
const carCompany = require("../../admin/model/carCompany");
const carModel = require("../../admin/model/carModel");
const CarDetails = require("../../partner/model/car");
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
                return res.status(404).json({ message: "No sub-models found for the given model ID" });
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
    getAllCarDetailsForFilter = async (req, res) => {
        try {
          
            const carCompanies = await carCompany.find({}, " carCompany");
            const carModels = await carModel.find({}, " model");
            const bodyStyles = await BodyStyle.find({}, " bodyStyle");
    
       
            const response = {
                carCompanies: carCompanies.map((company) => (company.carCompany)),
                carModels: carModels.map((model) => (  model.model)),
                bodyStyles: bodyStyles.map((style) => (style.bodyStyle))
            };
    
            res.status(200).json(response);
        } catch (error) {
            console.error("Error fetching details:", error);
            res.status(500).json({ error: "Failed to fetch details" });
    }};
    
}

module.exports = new GetCarController()