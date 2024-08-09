
const AdminService = require("../../services/shared/adminService");


class AdminController {
    getAdmin = async (req, res) => {
        try {
            const adminId = req.user.adminId;
            const result = await AdminService.getAdminById({ adminId });
            return res.status(200).json(result);
        } catch (error) {
           
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({ message: error.message });
        }
    }
    updateAdmin = async(req,res)=>{
        try {
            const AdminId = req.user.id;
            const AdminData = req.body
            const result = await AdminService.updateAdmin(AdminData , AdminId )
      return res.status(201).json({message:"Admin Update Successfully" , result })

        } catch (error) {
            return res.status(404).json({message:error.message})
        }
    }
}
module.exports = new AdminController()