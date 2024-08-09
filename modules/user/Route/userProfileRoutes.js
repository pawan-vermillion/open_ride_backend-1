const {Router} = require('express')
const router = Router();
const {getUser , updateUser} = require("../controller/userController");
const { userAuthenticate } = require("../middleware/userAuthenication")

router.use(userAuthenticate);
router.get("/" , getUser);
router.patch("/update" ,updateUser )

module.exports = router