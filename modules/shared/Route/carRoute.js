const {Router} = require("express")
const{sharedAuthentication} = require("../Middleware/validator/sharedAuthenication")
const GetCarController = require("../Controller/carController")
const router = Router();

router.use(sharedAuthentication)
router.get("/" ,GetCarController.getCarBodyStyles )
router.get("/allSubModel/" , GetCarController.getSubModels)

module.exports = router;