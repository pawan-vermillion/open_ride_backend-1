const {Router} = require('express')
const router = Router();



const {getUser , getUserById} = require("../../controller/shared/userController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);


router.get("/" ,getUser )
router.get("/:id" , getUserById)


module.exports = router