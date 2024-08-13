const CarCompany = require("../../model/carCompany");
const CarModel = require("../../model/carModel");

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

    async getCarComapny({adminId}){
        try {
            const result = await CarCompany.find(adminId).select('-__v');
            return result
            
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
}

module.exports =  new CarCompanyService()
