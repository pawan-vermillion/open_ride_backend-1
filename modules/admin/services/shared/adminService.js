const Admin = require("../../model/admin")
const bcrypt = require("bcrypt")
const { generateToken } = require("../../../shared/Service/authenication")


class AdminService {
    async createAdmin(adminDATA) {
        try {
       
        
            const {firstName , lastName , emailAddress , password , phoneNumber} = adminDATA
            const exitingUser = await Admin.findOne({
                $or:[{emailAddress} , {phoneNumber}]
            })
            if(exitingUser){
                const error = new Error("Your Account Is Already Exists")
                error.statusCode = 409
                throw error
            }
    
            const handlePassword = await bcrypt.hash(password , 10)
            
            const admin = await Admin.create({
                firstName , 
                lastName ,
                emailAddress ,
                password : handlePassword,
                phoneNumber
            })
            const token = generateToken(admin , "Admin");
            return {
                message : "User create Succeessfully",
                token
            }
        }  catch (error) {
            throw error
        }

    }
    async getAdminById({adminId}){
        try {
            const admin = await Admin.findById(adminId).select("-__v -password -createdAt -updatedAt");
            if(!admin){
                const error  = new error("admin not found")
                error.statusCode = 404;
                throw error;
            }
            return admin;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new AdminService()