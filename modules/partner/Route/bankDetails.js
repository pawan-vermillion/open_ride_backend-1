const { Router } = require('express')
const router = Router()

const {
    bankDetailsValidationRules,
    validate,
  } = require("../middleware/bankDetailsValidator");
const {partnerAuthenication} = require('../middleware/partnerAuthenication');
const BankDetailsController = require("../controller/bankDetailsController")

router.use(partnerAuthenication);
router.patch("/bankAccount" ,bankDetailsValidationRules(),validate,BankDetailsController.updateBankDetails)
router.get("/",BankDetailsController.getBankDetails)

module.exports = router;