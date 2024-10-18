const UserService = require("../../services/shared/userService");


class UserController {


  getUser = async (req, res, next) => {
    try {
      
      const UserId = req.user.id;
      const { limit, page , search} = req.query;
      const result = await UserService.getUser({ UserId  ,limit , page,search });
      return res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }



  getUserById = async (req, res, next) => {
    try {
      const  userId  = req.params.id;  

     
      const result = await UserService.getUserById( userId );
      return res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }
}
module.exports = new UserController()