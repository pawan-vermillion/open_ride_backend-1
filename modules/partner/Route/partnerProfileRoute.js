const {Router} = require("express")
const router = Router();
const {getPartners , updatePartner} = require("../controller/partnerController")
const { partnerAuthenication } = require("../middleware/partnerAuthenication");
const {upload , 
    uploadToCloudinary,
    convertBufferToFile
} = require("../../shared/config/multer");


router.use(partnerAuthenication)
router.get("/" , getPartners)
router.patch("/update",  upload.single('profileImage'),convertBufferToFile , updatePartner)

module.exports = router