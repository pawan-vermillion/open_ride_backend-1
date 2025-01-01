const {Router} = require("express")
const{sharedAuthentication} = require("../Middleware/validator/sharedAuthenication")
const GetCarController = require("../Controller/carController")
const router = Router();

router.use(sharedAuthentication)
router.get("/allSubModel" ,GetCarController.getCarBodyStyles )
router.get("/allSubModel/:modelId" , GetCarController.getSubModels)

module.exports = router;