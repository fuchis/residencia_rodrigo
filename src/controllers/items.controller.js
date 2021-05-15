const { Equipos, Prestamos, Horarios_Equipos, Sequelize, Usuarios } = require('../models');
const dateTimeService  = require('../services/dateTime.service');
const bitacoraService = require('../services/bitacora.service');
const db  = require('../models');
const Op = Sequelize.Op;

class ItemsController {

    async index(req, res, next) {

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
        
        try{
            let offset =  0 + (pagina - 1) * limite
            const equipos = await Equipos.findAndCountAll({
                raw: true,
                limit: limite,
                offset: offset
            });

            let equiposNuevos = equipos.rows.map(equipo => {
                switch(true){
                    case (equipo.Estado_Fisico_Equipo === 0):
                        equipo.Estado_Fisico_Equipo_Form = 'Optimas condiciones';
                        equipo.alerta = "btn btn-outline-success";
                        break;
                    case (equipo.Estado_Fisico_Equipo === 1):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita mantenimiento'
                        equipo.alerta = "btn btn-outline-secondary";
                        break;
                    case (equipo.Estado_Fisico_Equipo === 2):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita mantenimiento urgentemente'
                        equipo.alerta = "btn btn-outline-warning";
                        break;
                    case (equipo.Estado_Fisico_Equipo === 3):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita ser reemplazado urgentemente'
                        equipo.alerta = "btn btn-outline-danger";
                        break;
                    default:
                        console.log('EStado fisico del Equipo')
                }
        
                switch(true){
                    case (equipo.Estado === 0):
                        equipo.Estado_Form = 'Deshabilitado';
                        equipo.alerta_estado = "btn btn-outline-danger";
                        break;
                    case (equipo.Estado === 1):
                        equipo.Estado_Form = 'Habilitado'
                        equipo.alerta_estado = "btn btn-outline-primary";
                        break;
                    default:
                        console.log('Estado logico del Equipo')
                }

                return equipo;

            });

            
            nuevaEntradaDatos.Descripcion = "Consulto articulos";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            console.log(equiposNuevos)
            return res.render('items/inventario', {equipos:equiposNuevos, resultados: equipos.count, paginaActual: pagina, busqueda: false});

        }catch(error) {
            console.log(error)
        }
    }

    async create(req, res, next) {

        return res.render('items/register');
    }

    async search(req, res, next) {
        const { busqueda, id_usuario } = req.body;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            let  equipos = await Equipos.findAll(
                {
                    raw:true,
                    where: {
                        [Op.or] : {
                            Nombre: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Codigo_Serie: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Modelo: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Categoria: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Marca: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Descripcion: {
                                [Op.like] : `%${busqueda}%`
                            },

                        },
                        [Op.and]: {
                            Estado: {
                                [Op.ne]: 0
                            }
                        }
                        
                    }
                }
            );
            
            
            nuevaEntradaDatos.Descripcion = "Consulto articulos";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
        
            return res.render('items/prestar', {equipos: equipos, id_usuario: id_usuario, busqueda: true});
        }catch(e) {
            console.log(e)
            nuevaEntradaDatos.Descripcion = "Error al consultar articulos";
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            res.redirect('back');
        }
        return res.render('items/prestar');
    }

    async searchHistorial(req, res, next) {
        const { busqueda, id_usuario } = req.body;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            let  equipos = await Equipos.findAll(
                {
                    raw:true,
                    where: {
                        [Op.or] : {
                            Nombre: {
                                [Op.like] : `%${busqueda}%`
                        },
                                               
                    }
                }
            }
            );

            let equiposNuevos = equipos.map(equipo => {

                switch(true){
                    case (equipo.Estado_Fisico_Equipo === 0):
                        equipo.Estado_Fisico_Equipo_Form = 'Optimas condiciones';
                        equipo.alerta = "btn btn-outline-success";
                        break;
                    case (equipo.Estado_Fisico_Equipoo === 1):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita mantenimiento'
                        equipo.alerta = "btn btn-outline-secondary";
                        break;
                    case (equipo.Estado_Fisico_Equipo === 2):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita mantenimiento urgentemente'
                        equipo.alerta = "btn btn-outline-warning";
                        break;
                    case (equipo.Estado_Fisico_Equipo === 3):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita ser reemplazado urgentemente'
                        equipo.alerta = "btn btn-outline-danger";
                        break;
                    default:
                        console.log('EStado fisico del Equipo')
                }
        
                switch(true){
                    case (equipo.Estado === 0):
                        equipo.Estado_Form = 'Deshabilitado';
                        equipo.alerta_estado = "btn btn-outline-danger";
                        break;
                    case (equipo.Estado === 1):
                        equipo.Estado_Form = 'Habilitado'
                        equipo.alerta_estado = "btn btn-outline-primary";
                        break;
                    default:
                        console.log('Estado logico del Equipo')
                }
    
                return equipo;
    
            })
            
            nuevaEntradaDatos.Descripcion = "Consulto historial";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 

            return res.render('prestamos/index', {equipos: equiposNuevos, id_usuario: id_usuario, busqueda: true});
        }catch(e) {
            console.log(e)
        }
        return res.render('prestamos/index');
    }

    async searchpr(req, res, next) {
        const { busqueda } = req.body;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            let  usuarios = await Usuarios.findAll(
                {
                    raw:true,
                    where: {
                        [Op.or] : {
                            Nombre_Usuario: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Nombre: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Apellido: {
                                [Op.like] : `%${busqueda}%`
                            },

                        },
                        
                    }
                }
            );

            let nuevosUsuarios = usuarios.map( usuario => {
                switch(true){
                    case (usuario.Tipo === 1):
                        usuario.TipoForm = 'Administrador'
                        usuario.Administrador = true;
                        break;
                    case (usuario.Tipo === 2):
                        usuario.TipoForm = 'Servicio Social'
                        usuario.ServicioSocial = true;
                        break;
                    case (usuario.Tipo === 3):
                        usuario.TipoForm = 'Maestro'
                        usuario.Maestro = true;
                        break;
                    default:
                        console.log('Usuario Tipo')
                }

                switch(true){
                    case (usuario.Estado === 0):
                        usuario.Estado_Form = 'Deshabilitado';
                        usuario.alerta_estado = "btn-outline-danger";
                        break;
                    case (usuario.Estado === 1):
                        usuario.Estado_Form = 'Habilitado'
                        usuario.alerta_estado = "btn-outline-primary";
                        break;
                    default:
                        console.log('Estado logico del Equipo')
                }

                return usuario;
            })
            
            nuevaEntradaDatos.Descripcion = "Consulto historial";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 

            return res.render('prestamos/prestamosPR', {usuarios: usuarios, busqueda: true});
        }catch(e) {
            console.log(e)
        }
        return res.render('prestamos/prestamosPR');
    }

    async searchMostrar(req, res, next) {
        const { busqueda, id_usuario, tipo_operacion } = req.body;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            let  equipos = await Equipos.findAll(
                {
                    raw:true,
                    where: {
                        [Op.or] : {
                            Nombre: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Codigo_Serie: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Modelo: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Categoria: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Marca: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Descripcion: {
                                [Op.like] : `%${busqueda}%`
                            },

                        },
                        [Op.and]: {
                            Estado: {
                                [Op.ne]: 0
                            }
                        }
                        
                    }
                }
            );

            nuevaEntradaDatos.Descripcion = "Consulto articulos";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 

            if(tipo_operacion==='reservacion'){
                return res.render('items/reservar', {equipos: equipos, id_usuario: id_usuario, busqueda: true});
            }
            return res.render('items/prestar', {equipos: equipos, id_usuario: id_usuario, busqueda: true});
        }catch(e) {
            console.log(e)
        }
        
        if(tipo_operacion==='reservacion'){
            return res.render('items/reservar', {equipos: equipos, id_usuario: id_usuario, busqueda: true});
        }
        return res.render('items/prestar');
    }

    async searchEdicion(req, res, next) {
        const { busqueda, id_usuario } = req.body;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            let  equipos = await Equipos.findAll(
                {
                    raw:true,
                    where: {
                        [Op.or] : {
                            Nombre: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Codigo_Serie: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Modelo: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Categoria: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Marca: {
                                [Op.like] : `%${busqueda}%`
                            },
                            Descripcion: {
                                [Op.like] : `%${busqueda}%`
                            },
                                                                                    
                        },
                        [Op.and]: {
                            Estado: {
                                [Op.or]: [0,1]
                            },
                        
                        }
                        
                    }
                }
            );

            let equiposNuevos = equipos.map(equipo => {

                switch(true){
                    case (equipo.Estado_Fisico_Equipo === 0):
                        equipo.Estado_Fisico_Equipo_Form = 'Optimas condiciones';
                        equipo.alerta = "btn btn-outline-success";
                        break;
                    case (equipo.Estado_Fisico_Equipoo === 1):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita mantenimiento'
                        equipo.alerta = "btn btn-outline-secondary";
                        break;
                    case (equipo.Estado_Fisico_Equipo === 2):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita mantenimiento urgentemente'
                        equipo.alerta = "btn btn-outline-warning";
                        break;
                    case (equipo.Estado_Fisico_Equipo === 3):
                        equipo.Estado_Fisico_Equipo_Form = 'Necesita ser reemplazado urgentemente'
                        equipo.alerta = "btn btn-outline-danger";
                        break;
                    default:
                        console.log('EStado fisico del Equipo')
                }
        
                switch(true){
                    case (equipo.Estado === 0):
                        equipo.Estado_Form = 'Deshabilitado';
                        equipo.alerta_estado = "btn btn-outline-danger";
                        break;
                    case (equipo.Estado === 1):
                        equipo.Estado_Form = 'Habilitado'
                        equipo.alerta_estado = "btn btn-outline-primary";
                        break;
                    default:
                        console.log('Estado logico del Equipo')
                }
    
                return equipo;
    
            })
            
            nuevaEntradaDatos.Descripcion = "Consulto articulos";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 

            return res.render('items/inventario', {equipos: equiposNuevos, id_usuario: id_usuario, busqueda: true});
        }catch(e) {
            console.log(e)
        }
        return res.render('items/prestar');
    }

    async mostrar(req, res, next) {
        const {id_usuario} = req.query;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            let  equipos = await Equipos.findAll({raw:true, where: {
                Estado: {
                    [Op.ne]: 0
                },
                [Op.and]: {
                    Tiempo_Restante: {
                        [Op.ne]: '00:00:00'
                    }
                }
                
            }}); 

            nuevaEntradaDatos.Descripcion = "Consulto articulos";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            return res.render('items/prestar', {equipos: equipos, Id_Usuario: id_usuario, search: false});
        }catch(e) {
            console.log(e)
        }
    }

    async mostrarPrestados(req, res, next) {
        const {id_usuario} = req.query;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            let query = `SELECT * FROM residencia_dev.equipos WHERE Id_Equipo IN (SELECT DISTINCT Id_Equipo FROM residencia_dev.prestamos where Id_Usuario=${id_usuario} and Estado='P')`;
            
            let equipos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});

            if(equipos.length > 0) {
                return res.render('items/devolver', {equipos: equipos, Id_Usuario: id_usuario});
            }

            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}})
            nuevaEntradaDatos.Descripcion = `Consulto prestamos de usuario ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
        
            return res.render('items/devolver', {equipos: equipos, Id_Usuario: id_usuario, NoReservacion:true});
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudieron consultar los prestamos del usuario`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            res.redirect('back');
        }
    }


    async mostrarPrestado(req, res, next) {
        const {id_usuario, id_equipo} = req.query;
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
            
            let equipos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
        
            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}})
            nuevaEntradaDatos.Descripcion = `Consulto prestamos de usuario ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            return res.render('items/devolverItem', {equipos: equipos, Id_Usuario: id_usuario});
        }catch(e) {
            console.log(e)
            nuevaEntradaDatos.Descripcion = `No se pudieron consultar los prestamos del usuario`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            res.redirect('back');
        }
    }

    async devolverPrestados(req, res, next) {
        
    }

    async devolverPrestado(req, res, next) {
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
                Estado: 'Devuelto'
            }, { raw:true, where: {Id_prestamo: id_prestamo}})

            const restar_vida_util = await db.sequelize.query(`CALL Tiempo(${id_equipo}, '01:00:00');`)

            let horario_actualizado = await Horarios_Equipos.update({
                Estado: 'D'
            }, { raw:true, where: {Id_Horario_Equipos: fk_horarios}})

            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}})
            nuevaEntradaDatos.Descripcion = `Devolvio prestamo de usuario ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=3;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            req.flash('success', 'Equipo Devuelto Exitosamente')
            res.redirect('back');
        }catch (e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudo devolver equipo`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            req.flash('message', 'No se pudo devolver equipo')
            res.redirect('back');
        }

    }

    async prestar(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        try{

            const {id_usuario, id_equipo} = req.body;
            let id_horarios = req.body['horarios[]'];
            let  equipos = await Equipos.findAll({raw:true}); 
       
            if(typeof(id_horarios) === 'string'){
                let horario = id_horarios;
                id_horarios = []
                id_horarios.push(horario)
            }

            let prestamos = await Promise.all(id_horarios.map(async(id) => { 
                console.log(id)
                let fecha = await dateTimeService.getTimeIsoFormat();
                let prestamos = Prestamos.create({
                    Id_Usuario: id_usuario,
                    Id_Equipo: id_equipo,
                    Fecha: fecha,
                    Estado: 'P',
                    fk_horarios: id
                }, {raw:true})
                let horario_actualizado = await Horarios_Equipos.update({
                    Estado: 'P'
                }, { raw:true, where: 
                    {
                        [Op.and]: {
                            Estado: 'D'
                        },
                        [Op.and]: {
                            Id_Horario_Equipos: id
                        }
                    }
                })
                return prestamos;
            }))

            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}})

            if(prestamos.length > 0) {
                nuevaEntradaDatos.Descripcion = `Devolvio prestamo de usuario ${usuario.Nombre_Usuario}`;
                nuevaEntradaDatos.Tipo=3;
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
                req.flash('success', 'Prestamo creado Exitosamente')
                res.redirect('/prestamosPR');
            }
                
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudo crear el Prestamo del equipo`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            req.flash('message', 'No se pudo crear el Prestamo del equipo')
            res.redirect('back');
        }
    }

    async reservarEquipo(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try{

            const {id_usuario, id_equipo} = req.body;
            let id_horarios = req.body['horarios[]'];
            let  equipos = await Equipos.findAll({raw:true}); 
       
            if(typeof(id_horarios) === 'string'){
                let horario = id_horarios;
                id_horarios = []
                id_horarios.push(horario)
            }

            let prestamos = await Promise.all(id_horarios.map(async(id) => { 
                console.log(id)
                let fecha = await dateTimeService.getTimeIsoFormat();
                let prestamos = Prestamos.create({
                    Id_Usuario: id_usuario,
                    Id_Equipo: id_equipo,
                    Fecha: fecha,
                    Estado: 'R',
                    fk_horarios: id
                }, {raw:true})
                let horario_actualizado = await Horarios_Equipos.update({
                    Estado: 'R'
                }, { raw:true, where: 
                    {
                        [Op.and]: {
                            Estado: 'D'
                        },
                        [Op.and]: {
                            Id_Horario_Equipos: id
                        }
                    }
                
                })
                return prestamos;
            }))

            
            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}});        
            if(prestamos.length > 0) {
                nuevaEntradaDatos.Descripcion = `Reservación creada exitosamente para el usuario: ${usuario.Nombre_Usuario}`;
                nuevaEntradaDatos.Tipo=3;
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
                req.flash('success', 'Reservación creada Exitosamente');
                res.redirect('back');
            }
                
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudo crear la Reservación del equipo`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            req.flash('message', 'No se pudo crear la Reservación del equipo')
            res.redirect('back');
        }

    }

    async prestarVista(req, res, next) {
        const {id_equipo} = req.params;
        const {id_usuario} = req.query;
        try {
            let  equipo = await Equipos.findOne({ raw:true, where: {  Id_Equipo: id_equipo } });  

            let query = `SELECT * FROM (SELECT * FROM residencia_dev.horarios_equipos WHERE residencia_dev.horarios_equipos.FK_Id_Equipo = ${id_equipo} and residencia_dev.horarios_equipos.Estado = "D") hre 
            join residencia_dev.horarios on hre.Fk_Id_Horario=residencia_dev.horarios.Id_Horario;`
            
            let horarios = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
            
            return res.render('items/item', {equipo: equipo, Id_Usuario: id_usuario, horarios: horarios });
        }catch(e) {
            console.log(e)
        }
    }

    async cancelarVista(req, res, next) {
        const {id_usuario} = req.query;
        try {
            let query = `SELECT * FROM residencia_dev.equipos WHERE Id_Equipo IN (SELECT DISTINCT Id_Equipo FROM residencia_dev.prestamos where Id_Usuario=${id_usuario} and Estado='R')`;
            
            let equipos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});

            console.log(equipos)
            if(equipos.length > 0){
                return res.render('items/cancelar', {equipos: equipos, Id_Usuario: id_usuario});
            }
        
            return res.render('items/cancelar', {equipos: equipos, Id_Usuario: id_usuario, NoReservacion: true});
        }catch(e) {
            console.log(e)
        }
    }

    async cancelarReservacion(req, res, next) {
        const {id_equipo} = req.params;
        const {id_usuario} = req.query;
        try {
            let query = `SELECT Id_Horario_Equipos,Id_prestamo, Id_Usuario, Id_Equipo, Nombre, Estado, Estado_Equipo, fk_horarios, Hora_Inicio, Hora_Fin FROM
            (SELECT * FROM residencia_dev.prestamos)pr ,
            (SELECT Nombre, Id_Equipo AS equipoID, Estado as Estado_Equipo FROM residencia_dev.equipos) eq,
            (SELECT Id_Horario_Equipos, FK_Id_Horario, FK_Id_Equipo, Estado AS ESTATUS FROM residencia_dev.horarios_equipos) hrq, 
            (SELECT * FROM residencia_dev.horarios) hr
            WHERE pr.Id_Equipo=${id_equipo} and pr.Id_Usuario=${id_usuario} and pr.Estado='R' and hrq.ESTATUS = 'R' and pr.Id_Equipo=eq.equipoID and pr.fk_horarios=hrq.Id_Horario_Equipos and hrq.FK_Id_Horario=hr.Id_Horario;`;
            
            let equipos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
            let permisos = false;
            
            if(req.app.locals.usuario.Tipo != 3){
                permisos = true;
            }

            let nuevosEquipos = equipos.map(equipo => {
                if(equipo.Estado_Equipo === 0) {
                    equipo.disponibilidad=false;
                }else {
                    equipo.disponibilidad=true;
                }
                return equipo;
            })

            return res.render('items/cancelarReservacion', {equipos: nuevosEquipos, Id_Usuario: id_usuario, permisos: permisos});
        }catch(e) {
            console.log(e)
        }
    }

    async cancelar(req, res, next) {
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
                Estado: 'Cancelado'
            }, { raw:true, where: {Id_prestamo: id_prestamo}})
            let horario_actualizado = await Horarios_Equipos.update({
                Estado: 'D'
            }, { raw:true, where: {Id_Horario_Equipos: fk_horarios}})

            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}}); 

            nuevaEntradaDatos.Descripcion = `Reservación cancelada exitosamente para el usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=3;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            req.flash('success', 'Reservación cancelada exitosamente')
            res.redirect('back');

        }catch (e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudo cancelar reservación de equipo`;
            nuevaEntradaDatos.Tipo=53;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            req.flash('message', 'No se pudo cancelar reservación de equipo')
            res.redirect('back');
        }
        
    }

    async reservarVista(req, res, next) {
        const {id_usuario} = req.query;
        console.log(id_usuario)
        try {
            let  equipos = await Equipos.findAll({raw:true, where: {
                Estado: {
                    [Op.ne]: 0
                }
            }}); 
            return res.render('items/reservar', {equipos: equipos, Id_Usuario: id_usuario});
        }catch(e) {
            console.log(e)
        }
    }

    async reservar(req, res, next) {
        const {id_equipo} = req.params;
        const {id_usuario} = req.query;
        try {
            let  equipo = await Equipos.findOne({ raw:true, where: {  Id_Equipo: id_equipo } });  

            let query = `SELECT * FROM (SELECT * FROM residencia_dev.horarios_equipos WHERE residencia_dev.horarios_equipos.FK_Id_Equipo = ${id_equipo} and residencia_dev.horarios_equipos.Estado = "D") hre 
            join residencia_dev.horarios on hre.Fk_Id_Horario=residencia_dev.horarios.Id_Horario;`
            
            let horarios = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});
            
            return res.render('items/reservarEquipo', {equipo: equipo, Id_Usuario: id_usuario, horarios: horarios });
        }catch(e) {
            console.log(e)
        }
    }

    async store(req, res, nex) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        try{
            let {Nombre, Codigo_Serie, Modelo, Categoria, Marca, Descripcion, Estado, Estado_Fisico_Equipo, Tiempo_Original, Tiempo_Restante_Porcentaje } = req.body;

            let Tiempo_Restante = `${Tiempo_Original}:00:00`;
            Tiempo_Original= Tiempo_Restante;
            let aux = parseFloat(Tiempo_Restante_Porcentaje);
            Tiempo_Restante_Porcentaje = aux;

            const nuevoEquipo = {
                Nombre, Codigo_Serie, Modelo, Categoria, Marca, Descripcion, Estado, Estado_Fisico_Equipo, Tiempo_Original, Tiempo_Restante, Tiempo_Restante_Porcentaje
            }
            const equipo = await Equipos.create(nuevoEquipo, {raw: true});
            
            if( equipo ) {
                const llenarHorarios = await db.sequelize.query(`CALL CrearRelacionEquipoReservacion(${equipo.dataValues.Id_Equipo});`)
                nuevaEntradaDatos.Descripcion = `Equipo Creado Exitosamente`;
                nuevaEntradaDatos.Tipo=4;
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
                req.flash('success', 'Equipo Creado Exitosamente')
                res.redirect('/equipos')
            }
            
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudo crear equipo`;
            nuevaEntradaDatos.Tipo=5;
            req.flash('message', 'No se pudo crear equipo')
            res.redirect('back')
        }
    }

    async bajaEquipo(req, res, next) {
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
            const Item = await Equipos.update({Estado: 0},{raw: true, where: {
                Id_equipo: id_equipo
            }});

            nuevaEntradaDatos.Descripcion = `Equipo dado de baja con exito`;
            nuevaEntradaDatos.Tipo=4;
            req.flash('success', 'Equipo dado de baja con exito')
            res.redirect('back');
            }catch(e) {
                console.log(e);
                nuevaEntradaDatos.Descripcion = `No se pudo dar de baja al equipo`;
                nuevaEntradaDatos.Tipo=4;
                req.flash('message', 'No se pudo dar de baja al equipo')
                res.redirect('back')
            }
    }

    async editarEquipoVista(req, res, next) {
        const {id_equipo}  = req.params;
        try {
        let equipo = await Equipos.findOne({raw:true, where: {
            Id_Equipo: id_equipo
        }})

        return res.render('items/editarEquipo', {equipo:equipo})

        }catch(e) {
            console.log(e)
        }
    }

    async editarEquipo(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        const {id_equipo}  = req.params;
        let {
            Nombre, Marca, Codigo_Serie, Modelo, Categoria,  Descripcion, Estado, 
            Estado_Fisico_Equipo, Tiempo_Original, Tiempo_Restante_Porcentaje
        } = req.body;

        let Tiempo_Restante = `${Tiempo_Original}:00:00`;
        Tiempo_Original= Tiempo_Restante;
        let aux = parseFloat(Tiempo_Restante_Porcentaje);
        Tiempo_Restante_Porcentaje = aux;

        if(Estado_Fisico_Equipo == 0){
            Tiempo_Restante_Porcentaje = 100.0
        }else if(Estado_Fisico_Equipo == 1) {
            Tiempo_Restante_Porcentaje = 75.0
        }else if(Estado_Fisico_Equipo == 2) {
            Tiempo_Restante_Porcentaje = 50.0
        }else {
            Tiempo_Restante_Porcentaje = 25.0
        }

        if(Tiempo_Restante === 0) {
            Tiempo_Restante_Porcentaje = 0;
        }

        const equipo = {
            Nombre, Marca, Codigo_Serie, Modelo, Categoria,  
            Descripcion, Estado, Estado_Fisico_Equipo, Tiempo_Original, Tiempo_Restante,
            Tiempo_Restante_Porcentaje
        }

        console.log("EQUIPO")
        console.log(equipo);
                    
        try {
            
            let equipoActualizado = await Equipos.update(equipo, {raw:true, where: {
                Id_Equipo: id_equipo
            }})
           
            nuevaEntradaDatos.Descripcion = `Datos de equipo actualizados con exito`;
            nuevaEntradaDatos.Tipo=4;
            req.flash('success', 'Datos de equipo actualizados con exito')
            res.redirect('/equipos');
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudieron actualizar datos del equipo`;
            nuevaEntradaDatos.Tipo=4;
            req.flash('message', 'No se pudieron actualizar datos del equipo')
            res.redirect('back')
        }
    }

    async cancelarPrestamoEquipo(req, res, next) {
 
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
                Estado: 'Prestamo Cancelado'
            }, { raw:true, where: {Id_prestamo: id_prestamo}})

            let horario_actualizado = await Horarios_Equipos.update(
                {
                Estado: 'D'
            }, {
                raw:true, where: {Id_Horario_Equipos: fk_horarios
                }
            })

            let usuario = await Usuarios.findOne({raw: true, where : {Id_Usuario: id_usuario}}); 
            nuevaEntradaDatos.Descripcion = `Prestamo cancelado Exitosamente para el usuario ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=4;

            req.flash('success', 'Prestamo cancelado Exitosamente')
            res.redirect('back');
        }catch (e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudo cancelar prestamo`;
            nuevaEntradaDatos.Tipo=4;
            req.flash('message', 'No se pudo cancelar prestamo')
            res.redirect('back');
        }

        
        
    }
}

module.exports = new ItemsController();