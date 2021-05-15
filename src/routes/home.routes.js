const router = require("express").Router();
const { HomeController } = require("../controllers")
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

router.get("/",isNotLoggedIn, HomeController.index);


module.exports = router;