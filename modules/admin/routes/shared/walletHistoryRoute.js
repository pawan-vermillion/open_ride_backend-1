const {Router} = require('express')
const  


router = Router();



const WithdrawRequestController = require("../../controller/shared/withdrewController")
const WalletBalanceController = require("../../controller/shared/walletHistoryController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);


router.get("/history/:id" ,WalletBalanceController.getWalletHistory)
router.get("/request",WithdrawRequestController.getAllRequests)

router.patch("/request/:requestId",WithdrawRequestController.handleRequest)

module.exports = router