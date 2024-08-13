const {Router} = require('express')
const router = Router();
const {getUser , updateUser} = require("../controller/userController");
const { userAuthenticate } = require("../middleware/userAuthenication");
const {
    upload,
    uploadToCloudinary
  } = require("../../shared/config/multer")

router.use(userAuthenticate);
router.get("/" , getUser);
router.patch("/update"  , upload.single('profileImage'),updateUser )

module.exports = router