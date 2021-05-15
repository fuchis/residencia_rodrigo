const { Sequelize, Parametros} = require('../models');
const db  = require('../models');
const Op = Sequelize.Op;
const bitacoraService = require('../services/bitacora.service.js');
const dateTimeService = require('../services/dateTime.service.js');

class SistemaController {

    async index(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
           Id_Usuario:req.app.locals.usuario.Id_Usuario, 
           Usuario: req.app.locals.usuario.Nombre_Usuario,
           Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
           Descripcion: null, 
           Fecha: await dateTimeService.getTimeIsoFormat()
        }

        try{
            
            nuevaEntradaDatos.Descripcion = "Consulto datos el sistema";
            nuevaEntradaDatos.Tipo=2; 
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
            const parametros = await Parametros.findOne({raw: true, where: {Id_Parametros: 1}});
            
            if(parametros===null || parametros.length===0) {
                return res.render('sistema/index', {parametros: false });
            }else {
                return res.render('sistema/index', {parametros: true, telefono: parametros.Telefono, correo: parametros.Email, notificar: parametros.Notificar});
            }
        }catch(error) {
            console.log(error)
        }

    }

    async update(req, res, next) {
        const {Email, Password, Notificar, Telefono } = req.body;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            const parametros = await Parametros.findAll({raw: true})
            
            if(parametros.length===0){
                const parametro = await Parametros.create({Email,Password, Notificar, Telefono}, {raw:true})
                nuevaEntradaDatos.Descripcion = "Datos el sistema actualizados correctamente";
                nuevaEntradaDatos.Tipo=4;
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);  
                req.flash('success','Datos el sistema actualizados correctamente')
                res.redirect('back')
            }else{
                const nuevosDatos = await Parametros.update({
                    Email, Password, Notificar, Telefono
                }, 
                {
                    where: {
                        Id_Parametros: 1
                    }
                })
                nuevaEntradaDatos.Descripcion = "Datos el sistema actualizados correctamente";
                nuevaEntradaDatos.Tipo=4;
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);  
                req.flash('success','Datos el sistema actualizados correctamente')
                res.redirect('back')
            }
            
            
        }catch(error) {
            console.log(error);
            nuevaEntradaDatos.Descripcion = "No se pudieron actualizar los datos del sistema";
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
            req.flash('message','No se pudieron actualizar los datos del sistema');
            res.redirect('back')
        }
    }
}

module.exports = new SistemaController();