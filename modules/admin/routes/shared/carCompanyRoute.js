const{Router} = require('express')
const router = Router()
const{adminAuthenticate}= require("../../middleware/adminAuthenication")
const CarCompanyController = require("../../controller/shared/carCompanyController");


router.use(adminAuthenticate);
router.post("/company", CarCompanyController.createCarCompnay);
router.get("/company",CarCompanyController.getCarComapny);
router.post("/model/:companyId",CarCompanyController.createCarModel);
router.get("/model/:companyId",CarCompanyController.getCarModel);
module.exports = router;