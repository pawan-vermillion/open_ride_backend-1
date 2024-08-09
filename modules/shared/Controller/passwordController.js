const PasswordService = require("../Service/passwordService")

class PasswordController {
    changePassword = async(req,res,next)=>{
        const {oldPassword , newPassword , userType } = req.body;
        const  entityId = req.user.id;

        try {
            const result = await PasswordService.changePassword({oldPassword , newPassword , entityId , userType})
            res.status(200).json(result)
        } catch (error) {
           res.status(error.statusCode).json({message:error.message});
        }
    }

    forgotPassword = async(req,res)=>{
        const {newPassword , userType , phoneNumber , otp} = req.body

        try {
            const result = await PasswordService.forgotPassword(
                newPassword , 
                userType,
                phoneNumber ,
                otp
             )
            res.status(200).json(result)
            
        } catch (error) {
           res.status(404).json({message:error.message})
        }
    }
}

module.exports = new PasswordController()