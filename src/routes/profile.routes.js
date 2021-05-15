const router = require("express").Router();
const { ProfileController } = require("../controllers")
const { isLoggedIn } = require('../middlewares/auth');

router.get("/profile", isLoggedIn, ProfileController.index);

module.exports = router;