const CarCompanyService = require("../../services/shared/carCompanyService")

class CarCompanyController {
    createCarCompnay = async(req,res)=>{
        try {
            let adminData = req.body
            const result = await CarCompanyService.createCarCompany(adminData)
            res.status(201).json(result)
        } catch (error) {
            if (error.code === 11000) {
                res.status(400).json({
                    message: "Car Company name already exists. Please choose a different name."
                });
            } else {
                res.status(500).json({
                    message: error.message
                });
            }
        }
    }
    getCarComapny = async(req,res)=>{
        try {
            const adminId = req.user.adminId
            const result = await CarCompanyService.getCarComapny({adminId})
            res.status(201).json(result)
        } catch (error) {
            res.status(500).json({
                message:error.message
            })
        }
    }

    createCarModel = async(req,res)=>{
        try {
            const { companyId } = req.params;
            const {model} = req.body;
            const result = await CarCompanyService.createCarModel({companyId,model})
            res.status(201).json(result)
        } catch (error) {
            res.status(404).json({
                message:error.message
            })
        }
    }

    getCarModel = async(req,res)=>{
        try {
            const { companyId } = req.params;            
          const result = await CarCompanyService.getCarModel({ companyId })
          res.status(201).json(result)  
        } catch (error) {
            res.status(500).json({
                message:error.message
            }) 
        }
    }
}

module.exports = new CarCompanyController()