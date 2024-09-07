const {Router} = require('express')
const  


router = Router();




const WalletBalanceController = require("../../controller/shared/walletHistoryController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);


router.get("/:id" ,WalletBalanceController.getWalletHistory)

module.exports = router