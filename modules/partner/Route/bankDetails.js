const { Router } = require('express')
const router = Router()

const {
    bankDetailsValidationRules,
    validate,
  } = require("../middleware/bankDetailsValidator");
const {partnerAuthenication} = require('../middleware/partnerAuthenication');
const BankDetailsController = require("../controller/bankDetailsController")

router.use(partnerAuthenication);
router.get("/",BankDetailsController.getBankDetails)
router.patch("/bankAccount" ,bankDetailsValidationRules(),validate,BankDetailsController.updateBankDetails)

module.exports = router;