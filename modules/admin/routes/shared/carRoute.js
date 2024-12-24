const{Router} = require('express')
const       router = Router()
const{sharedAuthentication}= require("../../../shared/Middleware/validator/sharedAuthenication")
const CarCompanyController = require("../../controller/shared/carCompanyController");
const AdminCarController = require("../../controller/shared/carController")
const CarVarificationController = require("../../controller/shared/carVerificationController")
const CarGetByPartnerIdController = require("../../controller/shared/carByPartnerIdController")
const { uploadMultiple,uploadLogo  } = require("../../../shared/config/multer");
const {CarValidationRules , carValidation}=require("../../../partner/middleware/carValidator");

router.use(sharedAuthentication);
router.post("/addCar/:partnerId",uploadMultiple,
    CarValidationRules(),       
    carValidation,   AdminCarController.createCar)
router.get("/",AdminCarController.getAllCars );
router.post("/company",uploadLogo, CarCompanyController.createCarCompany  );
router.get("/company",CarCompanyController.getCarComapny);
router.post("/addCarBody" ,CarCompanyController.createCarBodyStyle );
router.post("/subModel/:modelId" , CarCompanyController.createSubModel);
router.get("/:id", AdminCarController.getCarById );
router.get("/model/:companyId",CarCompanyController.getCarModel);
router.post("/model/:companyId",CarCompanyController.createCarModel);

// router.post("/model/:companyId",uploadLogo,CarCompanyController.createCarModel);
router.get("/verification/unverified" ,CarVarificationController.getUnverifiedAllCar );
router.patch("/verification/:carId", CarVarificationController.changeCarVerificationStatus );
router.get("/partner/:partnerId",CarGetByPartnerIdController.getCarsByPartnerId)


module.exports = router;