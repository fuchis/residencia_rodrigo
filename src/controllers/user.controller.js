const userService = require('../services/registerUser.service.js');
const bitacoraService = require('../services/bitacora.service.js');
const dateTimeService = require('../services/dateTime.service.js');
const { Usuarios, Sequelize } = require('../models');
const Op = Sequelize.Op;

class UserController {

    async index(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        let limite = 15;
        let pagina = 1;
        let tipo = 0;

        if(req.query.Pagina){
            pagina = parseInt(req.query.Pagina);
        }

        if(req.query.Tipo){
            tipo = parse.Int(req.query.Tipo);
        }

        
     
        try {
            let offset =  0 + (pagina - 1) * limite
            let  usuarios = await Usuarios.findAndCountAll({
                raw:true,
                limit: limite,
                offset: offset
            });
            
            let nuevosUsuarios = usuarios.rows.map( usuario => {
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
                        usuario.habilitado = false;
                        break;
                    case (usuario.Estado === 1):
                        usuario.Estado_Form = 'Habilitado'
                        usuario.alerta_estado = "btn-outline-primary";
                        usuario.habilitado = true;
                        break;
                    default:
                        console.log('Estado logico del Equipo')
                }

                return usuario;
            })

            nuevaEntradaDatos.Descripcion = "Consulto información de usuarios";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);  
            return res.render('users/index', {usuarios:  nuevosUsuarios, resultados: usuarios.count, paginaActual: pagina});
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = "Nose pudo consultar información de usuarios";
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);  
        }
    }


    async findOne(req, res, next) {
        const {id_usuario} = req.params;
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
        try {
            let  usuario = await Usuarios.findOne({raw:true, where: {
                Id_Usuario: id_usuario
            }});

            switch(true){
                case (usuario.Tipo === 1):
                    usuario.TipoForm = 'Administrador'
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

            nuevaEntradaDatos.Descripcion = `Consulto información de usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);  
            return res.render('users/soloUser', {usuarios: usuario, busqueda: true});
        }catch(e) {
            nuevaEntradaDatos.Descripcion = `No se pudo consultar información de usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);  
            console.log(e)
        }
    }

    async showOne(req, res, next) {
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
            let  usuario = await Usuarios.findOne({raw:true, where: {
                Id_Usuario: id_usuario
            }});

            switch(true){
                case (usuario.Tipo === 1):
                    usuario.TipoForm = 'Administrador'
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

            
            nuevaEntradaDatos.Descripcion = `Consulto información de usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);  
            
            return res.render('users/profile', {usuarios: usuario, busqueda: true});
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `Consulto información de usuario: ${usuario.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);  
        }
    }

    async search(req, res, next) {
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

            nuevaEntradaDatos.Descripcion = "Consulto información de usuarios";
            nuevaEntradaDatos.Tipo=2;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);   
            return res.render('users/index', {usuarios: usuarios, busqueda: true});
        }catch(e) {
            console.log(e)
            nuevaEntradaDatos.Descripcion = "Fallo al consultar información de usuarios";
            nuevaEntradaDatos.Tipo=5;
        }
        return res.render('users/index');
    }

    async create(req, res, next) {
        return res.render('users/register');
    }

    async store(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        try {
            const busquedaUsuario = await Usuarios.findOne({raw: true, where: {
                Nombre_Usuario: req.body.Nombre_Usuario
            }});

            if(busquedaUsuario){ 
                nuevaEntradaDatos.Descripcion = "Fallo al intentar registrar usuario, el usuario ya existe";
                nuevaEntradaDatos.Tipo=5;
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
                req.flash('message', 'El usuario ya existe');
                req.redirect('back');
            } else {
                const nuevoUsuario = await userService.RegisterUser(req.body);
                nuevaEntradaDatos.Descripcion = `Usuario: ${req.body.Nombre_Usuario} Registrado Exitosamente`;
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
                nuevaEntradaDatos.Tipo=4;
                req.flash('success', 'Usuario Creado Exitosamente');
                res.redirect('back');
            }
                
            
        }catch(e) {
            console.log(e);
            nuevaEntradaDatos.Descripcion = `No se pudo crear usuario: ${req.body.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
            req.flash('message', 'No se pudo crear usuario');
            res.redirect('back');
        }       
    }

    async update(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        
        let {Id_Usuario, Nombre_Usuario, Nombre, Apellido, Tipo, Pass, Estado, Telefono } = req.body;
        Id_Usuario=parseInt(Id_Usuario);
        let nuevaPass = await userService.HashPassword(Pass);

        const usuario = {
            Nombre_Usuario,
            Nombre,
            Apellido,
            Tipo: parseInt(Tipo),
            Pass:nuevaPass,
            Estado: parseInt(Estado),
            Telefono
        }

        try {
            const usuarioActualizado = await Usuarios.update(usuario, {raw: true, where: {Id_Usuario: Id_Usuario}});
            nuevaEntradaDatos.Descripcion = `Datos de usuario: ${usuario.Nombre_Usuario} actualizados`;
            nuevaEntradaDatos.Tipo=4;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
            req.flash('success','Datos de usuario actualizados con exito')
            res.redirect('usuarios')
        }catch(e) {
            console.log(e)
            nuevaEntradaDatos.Descripcion = `No se pudo editar usuario: ${req.body.Nombre_Usuario}`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
            req.flash('message',`No se pudo editar usuario: ${req.body.Nombre_Usuario}`)
            res.redirect('back')
        }
        

    }

    async delete(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        const {id_usuario} = req.body;
        
        try {
            let usuario = await Usuarios.update({
                Estado: 0,
            },{raw: true, where: {
                Id_Usuario: id_usuario
            }})

            usuario = await Usuarios.findOne({raw: true, where: {
                Id_Usuario: id_usuario
            }})
            nuevaEntradaDatos.Descripcion = `Usuario: ${usuario.Nombre_Usuario} deshabilitado con exito`;
            nuevaEntradaDatos.Tipo=4;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
            console.log(usuario)
            req.flash('success',`Usuario: ${usuario.Nombre_Usuario} deshabilitado con exito`);
            res.redirect('back');
        }catch(e) {
            console.log(e)
            nuevaEntradaDatos.Descripcion = `Usuario: ${usuario.Nombre_Usuario} no se pudo deshabilitadar`;
            nuevaEntradaDatos.Tipo=5;
            entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos);
            req.flash('success',`Usuario no se pudo deshabilitadar`);
            res.redirect('back');
        }
    }
}

module.exports = new UserController();