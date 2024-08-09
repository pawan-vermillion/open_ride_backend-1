

const UserService = require("../service/userService")

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

    updateUser = async(req,res)=>{
        try {
            const userId = req.user.id;
            const userData = req.body;


            const result = await UserService.updateUser(userId , userData)
            return res.status(200).json({message :" User Update Successfully" , result})

        } catch (error) {
          throw error;
        }
    }
}
module.exports = new UserController()