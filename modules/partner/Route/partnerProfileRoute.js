const {Router} = require("express")
const router = Router();
const {getPartner} = require("../controller/partnerController")
const { partnerAuthenication } = require("../middleware/partnerAuthenication");


router.use(partnerAuthenication)
router.get("/" , getPartner)

module.exports = router