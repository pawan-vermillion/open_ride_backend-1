const { Router } = require('express')
const router = Router()

const WalletBalanceController = require("../controller/walletBalance")
const {userAuthenticate} = require('../middleware/userAuthenication');


router.use(userAuthenticate);
router.get("/history" , WalletBalanceController.getWalletHistory )

module.exports = router;