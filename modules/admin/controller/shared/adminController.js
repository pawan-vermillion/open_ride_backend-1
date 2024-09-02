
const AdminService = require("../../services/shared/adminService");
const {uploadToCloudinary} = require('../../../shared/config/multer')

class AdminController {
    getAdmin = async (req, res) => {
        try {
            const adminId = req.user.id;
            
            
            const result = await AdminService.getAdminById({ adminId });
            return res.status(200).json(result);
        } catch (error) {
           
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({ message: error.message });
        }
    }
    updateAdmin = async(req, res) => {
        try {
            const adminId = req.user.id;
            const adminData = req.body;
    
            if (req.file) {
               
                adminData.profileImage = req.file.path;
            }
    
            const result = await AdminService.updateAdmin(adminData, adminId);
            return res.status(201).json({ message: "Admin Updated Successfully", result });
    
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}
module.exports = new AdminController()