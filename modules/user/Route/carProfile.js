const {Router} = require('express')
const router = Router();

const { userAuthenticate } = require("../middleware/userAuthenication");

router.use(userAuthenticate);
router.get("/allCars" );


module.exports = router