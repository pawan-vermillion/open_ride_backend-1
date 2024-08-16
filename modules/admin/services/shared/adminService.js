const Admin = require("../../model/admin")
const bcrypt = require("bcrypt")
const { generateToken } = require("../../../shared/Service/authenication")
const cloudinary = require("../../../shared/config/cloudinary")


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
                message : "Admin create Succeessfully",
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
                const error = new Error("Admin not found");
                error.statusCode = 404;
                throw error;
            }
            return admin;
        } catch (error) {
            throw error;
        }
    }
    async updateAdmin(adminData, adminId) {
        try {
            const admin = await Admin.findById(adminId);
            if (!admin) {
                const error = new Error("Admin not found");
                error.statusCode = 404;
                throw error;
            }
    
            if (adminData.profileImage && admin.profileImage) {
                const oldImagePublicId = admin.profileImage.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`uploads/other/profile/${oldImagePublicId}`);
            }
            const updatedAdmin = await Admin.findByIdAndUpdate(adminId, adminData, { new: true }).select("-__v -password -createdAt -updatedAt");
    
            return updatedAdmin;
        } catch (error) {
            throw error;
        }
    }
    
    
    
    
}

module.exports = new AdminService()