const AdminService = require("../../services/shared/AdminService");



class AdminController {
    getAdmin = async(req,res)=>{
        try {
            const adminId = req.user.adminId
            const result = await AdminService.getAdminById({adminId})
            return res.status(200).json(result);
        } catch (error) {
            throw error ;
        }
    }
}
module.exports = new AdminController()