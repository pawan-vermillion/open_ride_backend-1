const{Router} = require('express')
const router = Router()
const{adminAuthenticate}= require("../../middleware/adminAuthenication")
const CarCompanyController = require("../../controller/shared/carCompanyController");
const CarController = require("../../controller/shared/carController")

router.use(adminAuthenticate);
router.post("/company", CarCompanyController.createCarCompnay);
router.get("/company",CarCompanyController.getCarComapny);
router.get("/",CarController.getAllCars )
router.get("/:id", CarController.getCarById )
router.post("/model/:companyId",CarCompanyController.createCarModel);
router.get("/model/:companyId",CarCompanyController.getCarModel);
module.exports = router;