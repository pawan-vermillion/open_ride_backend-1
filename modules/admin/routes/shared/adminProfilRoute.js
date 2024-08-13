const {Router} = require('express')
const router = Router();
const {
    upload,
    uploadToCloudinary
  } = require("../../../shared/config/multer")


const {getAdmin , updateAdmin} = require("../../controller/shared/adminController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);

router.get("/" , getAdmin );
router.patch("/update" , upload.single('profileImage'),updateAdmin)

module.exports = router