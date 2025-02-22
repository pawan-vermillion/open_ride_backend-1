const {Router} = require("express")
const router = Router();

const { partnerAuthenication } = require("../middleware/partnerAuthenication");
const RepairCarController= require("../controller/repairCarController")


router.use(partnerAuthenication)
router.post("/",RepairCarController.repairCar)
router.get("/allCars",RepairCarController.getAllRepairCars)
router.get("/getCarList",RepairCarController.getCarList)

module.exports = router