const { Router } = require('express')
const router = Router()

const DriverController = require("../controller/driverController")
const {partnerAuthenication} = require('../middleware/partnerAuthenication');
const {upload , 
    uploadToCloudinary
} = require("../../shared/config/multer");

router.use(partnerAuthenication);
router.post("/details", upload.single('driverImage'), DriverController.addDriver);
router.get("/allDriver",DriverController.getDriversByPartner );
router.patch("/updateDetails/:driverId",DriverController.updateDrivers);
router.delete("/deleteDriver/:driverId",DriverController.deleteDriver)
module.exports = router;