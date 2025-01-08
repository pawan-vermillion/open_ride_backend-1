const { Router } = require('express')
const router = Router()

const DriverController = require("../controller/driverController")
const {partnerAuthenication} = require('../middleware/partnerAuthenication');
const {upload , 
    uploadToCloudinary,
    convertBufferToFile
} = require("../../shared/config/multer");

router.use(partnerAuthenication);
router.post("/details", upload.single('driverImage'),convertBufferToFile, DriverController.addDriver);
router.get("/allDriver",DriverController.getDriversByPartner );
router.patch("/updateDetails/:driverId",upload.single('driverImage'),DriverController.updateDrivers);
router.delete("/deleteDriver/:driverId",DriverController.deleteDriver)
module.exports = router;