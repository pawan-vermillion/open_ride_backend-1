const {Router} = require("express")
const{sharedAuthentication} = require("../Middleware/validator/sharedAuthenication")
const GetCarController = require("../Controller/carController")
const router = Router();

router.use(sharedAuthentication)
router.get("/allBodyStyle" ,GetCarController.getCarBodyStyles )
router.get("/allSubModel/:modelId" , GetCarController.getSubModels)
router.get("/allDetails" , GetCarController.getAllCarDetailsForFilter)

module.exports = router;