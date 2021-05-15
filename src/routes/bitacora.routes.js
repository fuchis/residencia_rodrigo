const router = require("express").Router();
const { BitacoraController } = require("../controllers")
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

router.get("/bitacora", isLoggedIn, BitacoraController.index);
router.get("/paginadorBitacora", BitacoraController.Paginador);
router.post("/bitacoraBusqueda", BitacoraController.bitacoraBusqueda);
router.get("/vaciarBitacora", BitacoraController.vaciarBitacora);
router.get("/descargarBitacora", BitacoraController.descargarPDF);
module.exports = router;