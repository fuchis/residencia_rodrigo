const router = require("express").Router();
const { ItemsController } = require("../controllers")
const { isLoggedIn } = require('../middlewares/auth');

router.get("/equipos", ItemsController.index);
router.get("/mostrarEquipos", ItemsController.mostrar);
router.post("/equipos", ItemsController.search);
router.post("/mostrarEquipos", ItemsController.searchMostrar);
router.post("/equiposEdicion", ItemsController.searchEdicion);
router.post("/equiposHistorial", ItemsController.searchHistorial);
router.post("/prestamossearch", ItemsController.searchpr);

router.get("/prestarEquipos/:id_equipo", ItemsController.prestarVista);
router.post("/prestarEquipos", ItemsController.prestar);
router.get("/registrarEquipos", ItemsController.create);
router.post("/registrarEquipos", ItemsController.store);

router.get("/devolverEquipos", ItemsController.mostrarPrestados);
router.post("/devolverEquipos", ItemsController.devolverPrestados);
router.get("/devolverEquipo", ItemsController.mostrarPrestado);
router.post("/devolverEquipo", ItemsController.devolverPrestado);

router.get("/reservarEquipos", ItemsController.reservarVista);
router.post("/reservarEquipo", ItemsController.reservarEquipo);
router.get("/reservarEquipo/:id_equipo", ItemsController.reservar);

router.get("/cancelarReservaciones", ItemsController.cancelarVista);
router.get("/cancelarReservacion/:id_equipo", ItemsController.cancelarReservacion);
router.post("/cancelarReservacion", ItemsController.cancelar);
router.post("/cancelarPrestamoEquipo", ItemsController.cancelarPrestamoEquipo);

router.post("/bajaEquipo/:id_equipo", ItemsController.bajaEquipo);

router.get("/editarEquipo/:id_equipo", ItemsController.editarEquipoVista);
router.post("/editarEquipo/:id_equipo", ItemsController.editarEquipo);
module.exports = router;