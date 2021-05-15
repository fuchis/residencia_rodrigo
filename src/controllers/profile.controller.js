const { Sequelize } = require('../models');
const db  = require('../models');
const Op = Sequelize.Op;
const bitacoraService = require('../services/bitacora.service.js');
const dateTimeService = require('../services/dateTime.service.js');

class ProfileController {

    async index(req, res, next) {
        const {Id_Usuario, Tipo} = req.app.locals.usuario;
        let query;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        if(Tipo === 3) {
            query = `SELECT max(Nombre) as Nombre, 
            COUNT(IF(Estado="Cancelado" or Estado="R", 1, Null))Reservados, 
            COUNT(IF(Estado="Devuelto" or Estado="P", 1, Null))Prestados 
            FROM (select * from prestamos) pr,
            (SELECT Nombre, Id_Equipo as Id_Eq FROM Equipos)eq 
            WHERE eq.Id_Eq=pr.Id_Equipo and pr.Id_Usuario=${Id_Usuario} group by Nombre;`; 
        }else {
            query = `SELECT max(Nombre) as Nombre, 
            COUNT(IF(Estado="Cancelado" or Estado="R", 1, Null))Reservados, 
            COUNT(IF(Estado="Devuelto" or Estado="P", 1, Null))Prestados 
            FROM (select * from prestamos) pr,
            (SELECT Nombre, Id_Equipo as Id_Eq FROM Equipos)eq 
            WHERE eq.Id_Eq=pr.Id_Equipo group by Nombre;`;
        }
           
        let equiposHistorial = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
        
        nuevaEntradaDatos.Descripcion = "Consulto Su propio perfil";
        nuevaEntradaDatos.Tipo=2;
        entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 

        return res.render('profile/index', {equiposHistorial: JSON.stringify(equiposHistorial)});
    }
}

module.exports = new ProfileController();