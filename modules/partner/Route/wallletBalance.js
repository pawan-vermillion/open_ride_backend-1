const { Router } = require('express')
const router = Router()

const WalletBalanceController = require("../controller/walletBalance")
const {withdrawRequestValidationRules ,validate} = require("../middleware/withdrewRequsetValidator")
const {partnerAuthenication} = require('../middleware/partnerAuthenication');


router.use(partnerAuthenication);
router.get("/history" , WalletBalanceController.getWalletHistory)

router.post("/request/apply",
    withdrawRequestValidationRules(),
  validate , WalletBalanceController.applyWithdraw
)
router.get("/requests",WalletBalanceController.getRequestsByPartner)

module.exports = router;