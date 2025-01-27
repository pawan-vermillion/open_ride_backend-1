

const UserService = require("../service/userService")
const { uploadToCloudinary } = require('../../shared/config/multer')

class UserController {

    getUser = async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await UserService.getUserById(userId); 
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message }); 
        }
    }


    updateUser = async (req, res) => {
        try {
          const userId = req.user.id;
          const userData = req.body;
          
          // Check if a file is uploaded
          if (req.file) {
            const profileImageURL = await uploadToCloudinary(
              req,
              req.file.path,
              "profileImage"
            );
            userData.profileImage = profileImageURL;
          }
      
          const result = await UserService.updateUser(userData, userId);
      
          return res.status(201).json({
            message: "User Updated Successfully",
            result,
          });
        } catch (error) {
          return res.status(404).json({ message: error.message });
        }
      };
      

}


module.exports = new UserController()