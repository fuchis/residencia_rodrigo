const { runInNewContext } = require('vm');
const { Sequelize, Bitacora } = require('../models');
const db  = require('../models');
const bitacoraService = require('../services/bitacora.service');
const Op = Sequelize.Op;
const dateTimeService = require('../services/dateTime.service.js');
const dates = {
    compare: function(a,b) {
        let response;
        if((a<b)){
            return 1;
        }else if((a>b||(b<a))){
            return -1;
        }else {
            return 0;
        }
        
    }
}

class BitacoraController {

    async index(req, res, next) {
        let limite = 15;
        let pagina = 1;
        let tipo = 0;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        if(req.query.Pagina){
            pagina = parseInt(req.query.Pagina);
        }

        if(req.query.Tipo){
            tipo = parse.Int(req.query.Tipo);
        }

        let offset = pagina*limite;

        
                
        
        try {
            nuevaEntradaDatos.Descripcion = "Consulto Bitacora";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
            let offset =  0 + (pagina - 1) * limite
            let registrosBitacora;
            if(tipo === 0){
                registrosBitacora = await Bitacora.findAndCountAll({
                    raw:true,
                    limit: limite,
                    offset: offset
                });
                return res.render("bitacora/index",{registros: registrosBitacora.rows, paginaActual: pagina,resultados: registrosBitacora.count, busqueda: false})
            }else {
                registrosBitacora = await Bitacora.findAndCountAll({
                    raw:true,
                    where: { Tipo: tipo},
                    limit: limite,
                    offset: offset
                  });
                  return res.render("bitacora/index",{registros: registrosBitacora.rows, paginaActual: pagina, resultados: registrosBitacora.count, busqueda: false})
            }
                
                return res.render("bitacora/index",{registros: registrosBitacora.rows, paginaActual: pagina, resultados: registrosBitacora.count, busqueda: false})
        }catch(error) {
            console.log(error)
        }
    }

    async Paginador(req, res, next) {
        try {
            const numeroRegistros = await Bitacora.count();
            const limite = 15;
            const Paginas = Math.ceil(numeroRegistros/limite);
            console.log(Paginas)
            res.send(JSON.stringify({paginas: numeroRegistros}))
        }catch(error){
            console.log(error);
        }
    }


    async bitacoraBusqueda(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        const busqueda = {};
        busqueda.busqueda = req.body.busqueda;
        busqueda.tipo = parseInt(req.body.filtro);
        busqueda.FechaInicio = req.body.fechaInicio;
        busqueda.FechaFin = req.body.fechaFin;
        let fechaInicio = new Date(busqueda.FechaInicio);
        let fechaFin = new Date(busqueda.FechaFin);
        nuevaEntradaDatos.Descripcion = "Consulto Bitacora";
        nuevaEntradaDatos.Tipo=2;
        entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
        console.log(dates.compare(fechaInicio , fechaFin))
        if(dates.compare(fechaInicio , fechaFin) === 0){
            if(busqueda.tipo===0) {
                try {
                    let  bitacora = await Bitacora.findAndCountAll(
                        {
                            raw:true,
                            where: {
                                [Op.or] : {
                                    Usuario: {
                                        [Op.like] : `%${busqueda.busqueda}%`
                                    },
                                    Nombre_Usuario: {
                                        [Op.like] : `%${busqueda.busqueda}%`
                                    },
                                    Descripcion: {
                                        [Op.like] : `%${busqueda.busqueda}%`
                                    },
                                },                                
                            }
                        }
                    );
                    
                    return res.render("bitacora/index",{registros: bitacora.rows, paginaActual: 1, resultados: bitacora.count, busqueda: true})
                    }catch(err) {
                        console.log(err)
                    }

            }else {
                try {
                    let  bitacora = await Bitacora.findAndCountAll(
                        {
                            raw:true,
                            where: {
                                [Op.or] : {
                                    Usuario: {
                                        [Op.like] : `%${busqueda.busqueda}%`
                                    },
                                    Nombre_Usuario: {
                                        [Op.like] : `%${busqueda.busqueda}%`
                                    },
                                },
                                [Op.and]: {
                                    Tipo: busqueda.tipo,
                                }
                                
                            }
                        }
                    );

                    
                    return res.render("bitacora/index",{registros: bitacora.rows, paginaActual: 1, resultados: bitacora.count, busqueda: true})
                    }catch(err) {
                        console.log(err)
                    }
            }
        }else if(dates.compare(fechaInicio , fechaFin) !== 0 && busqueda.Tipo !=0){
            try {
                let  bitacora = await Bitacora.findAndCountAll(
                    {
                        raw:true,
                        where: {
                            [Op.or] : {
                                Usuario: {
                                    [Op.like] : `%${busqueda.busqueda}%`
                                },
                                Nombre_Usuario: {
                                    [Op.like] : `%${busqueda.busqueda}%`
                                },
                            },
                            [Op.and]: {
                                Tipo: busqueda.tipo,
                                Fecha: {
                                    [Op.between]: [fechaInicio, fechaFin]
                                }
                            }
                            
                        }
                    }
                );

                
                return res.render("bitacora/index",{registros: bitacora.rows, paginaActual: 1, resultados: bitacora.count, busqueda: true})
                }catch(err) {
                    console.log(err)
                }
        }
    }

    async vaciarBitacora(req, res, next) {
        const archivo = await bitacoraService.GenerarPDF();
        const path = require('path')
        let file = path.resolve(archivo);
        let query = "TRUNCATE TABLE Bitacora;";
        let result = await db.sequelize.query(query);
        req.flash('success', 'Bitacora vaciada con exito');
        res.redirect('back');
    }

    async descargarPDF(req, res, next) {
        const path = require('path')
        let archivo = path.resolve('src/pdf/bitacora.pdf');
        const fs = require('fs');
        try {
            
            if(fs.existsSync(archivo)) {
                res.download(archivo, 'bitacora.pdf');
            }else {
                req.flash('message', 'No existe archivo de bitacora');
                res.redirect('back');
            }
        }catch(error) {
            console.log(error)
        }
        
    }
    
}

module.exports = new BitacoraController();