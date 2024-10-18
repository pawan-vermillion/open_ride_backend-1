const CarCompanyService = require("../../services/shared/carCompanyService")
const { uploadToCloudinary, uploadLogo } = require("../../../shared/config/multer")

class CarCompanyController {

    createCarCompany = async (req, res) => {

        try {
            if (!req.file) {
                return res.status(400).json({ message: "Logo image is required" });
            }

            const carCompanyData = req.body;
            carCompanyData.logoImage = req.file.path;

            const result = await CarCompanyService.createCarCompany({ carCompanyData });
            res.status(201).json(result);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: error.message });
        }
    };



    getCarComapny = async (req, res) => {
        try {
            const adminId = req.user.adminId;
            const search = req.query.search;
            const company = await CarCompanyService.getCarCompany(adminId, search);
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    createCarModel = async (req, res) => {
        try {

            const { companyId } = req.params;
            const { model } = req.body;

            const result = await CarCompanyService.createCarModel({ companyId, model });

            res.status(201).json(result);
        } catch (error) {
            res.status(404).json({
                message: error.message
            });
        }
    };


    getCarModel = async (req, res) => {
        try {
            const { companyId } = req.params;
            const { search } = req.query;
            const result = await CarCompanyService.getCarModel({ companyId, search });
            res.status(200).json(result); 
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    createCarBodyStyle = async (req, res) => {
        try {
            const carData = req.body;


            if (!carData.bodyStyle) {
                return res.status(400).json({ message: "bodyStyle is required" });
            }

            const result = await CarCompanyService.createCarBodyStyle({ carData });
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    createSubModel = async (req, res) => {
        try {
            const carData = req.body;
            const { modelId } = req.params;

            const result = await CarCompanyService.createSubModel({ subModel: carData.subModel, modelId });
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = new CarCompanyController()