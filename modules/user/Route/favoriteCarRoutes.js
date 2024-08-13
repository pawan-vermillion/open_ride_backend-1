const {Router} = require('express')
const router = Router();
const { userAuthenticate } = require("../middleware/userAuthenication");
const{favoriteCarValidationRules ,validate } = require("../middleware/favoriteCarValidationRule")
const favoriteCarController = require("../controller/favoriteCarController")

router.use(userAuthenticate);
router.post("/",favoriteCarValidationRules() , validate , favoriteCarController.addFavoriteCar )
// router.get("/" );
// router.patch("/update" )

module.exports = router