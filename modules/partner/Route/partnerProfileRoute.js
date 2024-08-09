const {Router} = require("express")
const router = Router();
const {getPartner , updatePartner} = require("../controller/partnerController")
const { partnerAuthenication } = require("../middleware/partnerAuthenication");


router.use(partnerAuthenication)
router.get("/" , getPartner)
router.patch("/update" , updatePartner)

module.exports = router