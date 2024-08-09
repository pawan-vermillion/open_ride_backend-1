const {Router} = require('express')
const router = Router();

const {getAdmin , updateAdmin} = require("../../controller/shared/adminController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);

router.get("/" , getAdmin );
router.patch("/update" , updateAdmin)

module.exports = router