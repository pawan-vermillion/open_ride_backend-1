const {Router} = require('express')
const  router = Router();

const OfflineBookingController = require('../../controller/offlineBookingController')
const {getPartner , getPartnerById , createWithdrawRequest} = require("../../controller/shared/partnerController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);


router.get("/" ,getPartner )
router.get("/:id" ,getPartnerById )
router.get("/offline/:partnerId" ,OfflineBookingController.getAllOfflineBookings )

// offilce booking no route 



module.exports = router