const {Router} = require('express')
const router = Router();

const {getAdmin} = require("../../controller/shared/adminController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);

router.get("/" , getAdmin );

module.exports = router