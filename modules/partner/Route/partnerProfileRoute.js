const {Router} = require("express")
const router = Router();
const {getPartner , updatePartner} = require("../controller/partnerController")
const { partnerAuthenication } = require("../middleware/partnerAuthenication");
const {upload , 
    uploadToCloudinary
} = require("../../shared/config/multer");


router.use(partnerAuthenication)
router.get("/" , getPartner)
router.patch("/update",  upload.single('profileImage') , updatePartner)

module.exports = router