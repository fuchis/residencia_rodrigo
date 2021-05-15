const router = require("express").Router();
const { UserController } = require("../controllers")
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

router.get("/usuarios", isLoggedIn, UserController.index);
router.get("/usuarios/:id_usuario", isLoggedIn, UserController.findOne);
router.post("/usuarios", isLoggedIn, UserController.search);

router.get("/register", UserController.create);
router.post("/register", isLoggedIn, UserController.store);
router.post("/bajaUsuario", UserController.delete);
router.post("/editarUsuario", UserController.update);
router.get("/editarUsuario", UserController.showOne);
module.exports = router;