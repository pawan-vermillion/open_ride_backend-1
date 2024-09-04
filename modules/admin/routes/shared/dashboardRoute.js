const {Router} = require('express')
const router = Router();



const DahboardController = require("../../controller/shared/dashboardController")
const {adminAuthenticate} = require("../../middleware/adminAuthenication")

router.use(adminAuthenticate);


router.get("/allDetails",DahboardController.getDashboardCountController  )



module.exports = router