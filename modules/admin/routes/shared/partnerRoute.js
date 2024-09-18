const {Router} = require('express')
const  


router = Router();



const {getPartner , getPartnerById , createWithdrawRequest} = require("../../controller/shared/partnerController")

const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);


router.get("/" ,getPartner )
router.get("/:id" ,getPartnerById )



module.exports = router