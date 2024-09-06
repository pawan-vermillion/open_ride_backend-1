const {Router} = require('express')
const router = Router();

const {
    bankDetailsValidationRules,
    validate,
  } = require("../../../partner/middleware/bankDetailsValidator");

const  BankDetailsController= require("../../controller/shared/bankDetalsController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);


router.patch("/partner/:partnerId"  ,bankDetailsValidationRules(),validate, BankDetailsController.updateBankDetails)
router.get("/:partnerId" , BankDetailsController.getBankDetails)


module.exports = router