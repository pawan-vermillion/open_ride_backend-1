

const UserService = require("../service/userService")
const {uploadToCloudinary} = require('../../shared/config/multer')

class UserController {
    getUser = async (req, res) => {
        try {
           

            const userId = req.user.id;

            const result = await UserService.getUserById({userId});
            return res.status(200).json(result);
        } catch (error) {
            throw error;
        }
    }

    updateUser = async (req, res) => {
        try {
            const userId = req.user.id;
            const userData = req.body;

         
            if (req.file) {
            
                userData.profileImage = req.file.path;
            }

            const result = await UserService.updateUser(userData, userId);
            return res.status(200).json({ message: "User updated successfully", result });
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}
   

module.exports = new UserController()