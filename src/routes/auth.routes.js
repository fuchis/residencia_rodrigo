const router = require("express").Router();
const { AuthController } = require("../controllers")
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');
// Desplegar vista login
router.get("/",isNotLoggedIn, AuthController.index);
router.get("/login",isNotLoggedIn, AuthController.index);
// mandar datos de login
router.post("/login", isNotLoggedIn, AuthController.login);
router.get("/logout", isLoggedIn, AuthController.destroy);
// Desplegar vista de registro de usuario
router.get("/auth/register", isNotLoggedIn, AuthController.create);
// Mandar datos de registro de usuario
router.post("/auth", isLoggedIn, AuthController.store);

module.exports = router;