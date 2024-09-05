const { Router } = require('express')
const router = Router()

const EarningController = require("../controller/earningController")
const {partnerAuthenication} = require('../middleware/partnerAuthenication');


router.use(partnerAuthenication);
router.get("/" ,EarningController.earningFilter)

module.exports = router;