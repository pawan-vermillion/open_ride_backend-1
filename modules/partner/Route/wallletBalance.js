const { Router } = require('express')
const router = Router()

const WalletBalanceController = require("../controller/walletBalance")
const {partnerAuthenication} = require('../middleware/partnerAuthenication');


router.use(partnerAuthenication);
router.get("/history" , WalletBalanceController.getWalletHistory)

module.exports = router;