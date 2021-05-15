const router = require("express").Router();
const { PrestamosController } = require("../controllers")
const { isLoggedIn } = require('../middlewares/auth');

router.post("/AutorizarPrestamo", isLoggedIn, PrestamosController.prestamo);
router.get("/verPrestamos", isLoggedIn, PrestamosController.verPrestamos);
router.get("/verPrestamo/:id_equipo", isLoggedIn, PrestamosController.verPrestamo);
router.get("/prestamosPR", isLoggedIn, PrestamosController.prestamosPR);
router.get("/prestamosHistorial", isLoggedIn, PrestamosController.prestamosHistorial);
router.get("/vaciarG", PrestamosController.vaciarG);
//router.get("/vaciarHistorial", PrestamosController.vaciarHistorial);
//router.get("/descargarHistorial", PrestamosController.descargarHPDF);
module.exports = router;