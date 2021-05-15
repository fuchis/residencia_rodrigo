const router = require("express").Router();
const { SistemaController } = require("../controllers")
const { isLoggedIn } = require('../middlewares/auth');

router.get("/sistema", isLoggedIn, SistemaController.index);
router.post("/sistema", isLoggedIn, SistemaController.update);

module.exports = router;