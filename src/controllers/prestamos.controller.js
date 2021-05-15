const { Prestamos, Horarios_Equipos, Sequelize, Usuarios} = require('../models');
const dateTimeService  = require('../services/dateTime.service');
const bitacoraService = require('../services/bitacora.service.js');
//const prestamosService = require('../services/prestamos.service.js');
const db  = require('../models');
const Op = Sequelize.Op;


class PrestamosController {

    async index(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
           Id_Usuario:req.app.locals.usuario.Id_Usuario, 
           Usuario: req.app.locals.usuario.Nombre_Usuario,
           Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
           Descripcion: null, 
           Fecha: await dateTimeService.getTimeIsoFormat()
        }
        nuevaEntradaDatos.Descripcion = "Consulto prestamos";
        nuevaEntradaDatos.Tipo=3;
        entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
        
        return res.render('profile/index', {equiposHistorial: JSON.stringify(equiposHistorial)});
    }

    async prestamo(req, res, next) {
        const {id_usuario, id_equipo, id_prestamo, fk_horarios} = req.body;
        let entrada;
        const nuevaEntradaDatos = {
           Id_Usuario:req.app.locals.usuario.Id_Usuario, 
           Usuario: req.app.locals.usuario.Nombre_Usuario,
           Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
           Descripcion: null, 
           Fecha: await dateTimeService.getTimeIsoFormat()
        }
        
        
        try{
            let prestamos_actualizados = await Prestamos.update({ 
                Estado: 'P'
            }, { raw:true, where: {Id_prestamo: id_prestamo}})
            let horario_actualizado = await Horarios_Equipos.update({
                Estado: 'P'
            }, { raw:true, where: {Id_Horario_Equipos: fk_horarios}})
            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}})
            nuevaEntradaDatos.Descripcion = `Prestamo autorizado a: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=3;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            req.flash('success', 'Autorizacion realizada exitosamente')
            res.redirect('back');
        }catch (e) {

            console.log(e);
            nuevaEntradaDatos.Descripcion = `Prestamo autorizado a: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            req.flash('message', `Prestamo autorizado a: ${usuario.Nombre_Usuario}`)
            res.redirect('back');
        }
        
        
    }


    async verPrestamos(req, res, next) {
        const {id_usuario} = req.query;
        let entrada;
        const nuevaEntradaDatos = {
        Id_Usuario:req.app.locals.usuario.Id_Usuario, 
        Usuario: req.app.locals.usuario.Nombre_Usuario,
        Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
        Descripcion: null, 
        Fecha: await dateTimeService.getTimeIsoFormat()
        }
        let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}})
        
        try {
            let query = `SELECT * FROM residencia_dev.equipos WHERE Id_Equipo IN (SELECT DISTINCT Id_Equipo FROM residencia_dev.prestamos where Id_Usuario=${id_usuario} and Estado='P')`;
            let equipos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
         
            if(equipos.length > 0){
                nuevaEntradaDatos.Descripcion = `Consulto prestamos de usuario: ${usuario.Nombre_Usuario}`;
                nuevaEntradaDatos.Tipo=3;
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
                return res.render('items/verprestamos', {equipos: equipos, Id_Usuario: id_usuario, texto: "PRESTAMOS"});
            }

            nuevaEntradaDatos.Descripcion = `Consulto prestamos de usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=3;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            
            return res.render('items/verprestamos', {equipos: equipos, Id_Usuario: id_usuario, NoReservacion: true, texto: "PRESTAMOS"});
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudo onsultar prestamos de usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=5;
            res.redirect('back');
        }
    }

    async verPrestamo(req, res, next) {
        const {id_usuario,} = req.query;
        const {id_equipo} = req.params;
        let entrada;
        const nuevaEntradaDatos = {
           Id_Usuario:req.app.locals.usuario.Id_Usuario, 
           Usuario: req.app.locals.usuario.Nombre_Usuario,
           Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
           Descripcion: null, 
           Fecha: await dateTimeService.getTimeIsoFormat()
        }

        try {
            let query = `SELECT Id_Horario_Equipos,Id_prestamo, Id_Usuario, Id_Equipo, Nombre, Estado, fk_horarios, Hora_Inicio, Hora_Fin FROM
            (SELECT * FROM residencia_dev.prestamos)pr ,
            (SELECT Nombre, Id_Equipo AS equipoID FROM residencia_dev.equipos) eq,
            (SELECT Id_Horario_Equipos, FK_Id_Horario, FK_Id_Equipo, Estado AS ESTATUS FROM residencia_dev.horarios_equipos) hrq, 
            (SELECT * FROM residencia_dev.horarios) hr
            WHERE pr.Id_Equipo=${id_equipo} and pr.Id_Usuario=${id_usuario} and pr.Estado='P' and hrq.ESTATUS = 'P' and pr.Id_Equipo=eq.equipoID and pr.fk_horarios=hrq.Id_Horario_Equipos and hrq.FK_Id_Horario=hr.Id_Horario;`;
            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}});
            let equipos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
            nuevaEntradaDatos.Descripcion = `Consulto prestamo de usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=3;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            return res.render('items/verPrestamo', {equipos: equipos, Id_Usuario: id_usuario});
        }catch(e) {
            console.log(e)
            nuevaEntradaDatos.Descripcion = `No se pudo consultar prestamo de usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            res.redirect('back');
        }

    }


    async prestamosHistorial(req, res,  next) {
        let entrada;
        const nuevaEntradaDatos = {
           Id_Usuario:req.app.locals.usuario.Id_Usuario, 
           Usuario: req.app.locals.usuario.Nombre_Usuario,
           Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
           Descripcion: null, 
           Fecha: await dateTimeService.getTimeIsoFormat()
        }

        let limite = 80;
        let pagina = 1;
        let tipo = 0;

        if(req.query.Pagina){
            pagina = parseInt(req.query.Pagina);
        }

        if(req.query.Tipo){
            tipo = parse.Int(req.query.Tipo);
        }
        try {
            let offset =  0 + (pagina - 1) * limite;
            let query = `SELECT DISTINCT Id_Prestamo, Usuario_Id, Nombre_Usuario, Nombre, Apellido, Equipo_Id, Nombre_Equipo,  Estado_Equipo, Fecha FROM
            (SELECT Id_Prestamo, Estado as Estado_Equipo, Id_Usuario as Usuario_Id, Id_Equipo as Equipo_Id, Fecha FROM prestamos) prestamos,
            (SELECT * FROM usuarios) usuarios,
            (SELECT Nombre as Nombre_Equipo, Id_Equipo FROM equipos) equipos
            WHERE prestamos.Usuario_Id = usuarios.Id_Usuario AND prestamos.Equipo_Id = equipos.Id_Equipo LIMIT ${offset},${limite};`

            let queryCount = `SELECT COUNT(*) as counter FROM
            (SELECT Id_Prestamo, Estado as Estado_Equipo, Id_Usuario, Id_Equipo, Fecha FROM prestamos) prestamos,
            (SELECT * FROM usuarios) usuarios,
            (SELECT Nombre as Nombre_Equipo, Id_Equipo FROM equipos) equipos
            WHERE prestamos.Id_Usuario = usuarios.Id_Usuario AND prestamos.Id_Equipo = equipos.Id_Equipo;`

            const prestamos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
            const count = await db.sequelize.query(queryCount, {raw:true, type: db.sequelize.QueryTypes.SELECT});
            nuevaEntradaDatos.Descripcion = "Consulto historico de prestamos/reservaciones";
            nuevaEntradaDatos.Tipo=3;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            res.render("prestamos/index", {prestamos: prestamos, paginaActual: pagina, busqueda: true, resultados:count[0].counter})
        }catch(error) {
            console.log(error)
        }

    }

    async vaciarG(req, res, next) {
        const archivo = await bitacoraService.GenerarPDF();
        const path = require('path')
        let file = path.resolve(archivo);
        let query = "TRUNCATE TABLE prestamos;";
        let result = await db.sequelize.query(query);
        req.flash('success', 'Bitacora vaciada con exito');
        res.redirect('back');
    }

    async prestamosPR(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
           Id_Usuario:req.app.locals.usuario.Id_Usuario, 
           Usuario: req.app.locals.usuario.Nombre_Usuario,
           Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
           Descripcion: null, 
           Fecha: await dateTimeService.getTimeIsoFormat()
        }

        let limite = 5;
        let pagina = 1;
        let tipo = 0;

        if(req.query.Pagina){
            pagina = parseInt(req.query.Pagina);
        }

        if(req.query.Tipo){
            tipo = parse.Int(req.query.Tipo);
        }

        try {
            let offset =  0 + (pagina - 1) * limite;
            let query = `SELECT DISTINCT Id_Prestamo, Usuario_Id, Nombre_Usuario, Nombre, Apellido,Equipo_Id, Nombre_Equipo,  Estado_Equipo, Fecha  FROM
            (SELECT Id_Prestamo, Estado as Estado_Equipo, Id_Usuario as Usuario_Id, Id_Equipo as Equipo_Id, Fecha FROM prestamos WHERE Estado="P" OR Estado="R") prestamos,
            (SELECT * FROM usuarios) usuarios,
            (SELECT Nombre as Nombre_Equipo, Id_Equipo FROM equipos) equipos
            WHERE prestamos.Usuario_Id = usuarios.Id_Usuario AND prestamos.Equipo_Id = equipos.Id_Equipo`;

            const prestamos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
            nuevaEntradaDatos.Descripcion = "Consulto prestamos/reservaciones activas";
            nuevaEntradaDatos.Tipo=3;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            res.render("prestamos/prestamosPR", {prestamos: prestamos, paginaActual: pagina, busqueda: false})
        }catch(error) {
            console.log(error)
        }
        
    }

    async vaciarHistorial(req, res, next) {
        const archivo = await prestamosService.GenerarPDF();
        const path = require('path')
        let file = path.resolve(archivo);
        //let query = "TRUNCATE TABLE prestamos;";
        //let result = await db.sequelize.query(query);
        req.flash('success', 'Historial vaciada con exito');
        res.redirect('back');
   }

    async descargarHPDF(req, res, next) {
        const path = require('path')
        let archivo = path.resolve('src/pdf/historial_prestamos.pdf');
        const fs = require('fs');
        try {
           
            if(fs.existsSync(archivo)) {
                res.download(archivo, 'historial_prestamos.pdf');
            }else {
                req.flash('message', 'No existe archivo de historial');
                res.redirect('back');
            }
        }catch(error) {
            console.log(error)
        }   
   }
    
}

    

module.exports = new PrestamosController();