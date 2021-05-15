const { Usuarios } = require("../models");
const passport = require('passport');
const dateTimeService  = require('../services/dateTime.service');
const bitacoraService = require('../services/bitacora.service');

class AuthController {

    async index(req, res, next) { 
       return res.render('auth/login', {"Titulo":"Login","mensaje": "Hola",  });
    }

    async create(req, res, next) {
        return res.render('auth/register', {"Titulo": "Registro"});
    }

    async store(req, res, next) { 
        passport.authenticate('local.signup', {
            successRedirect: '/profile',
            failureRedirect: '/register'
        })(req, res, next);
    }        

    async update(req, res, next) {
        return res.json( {"mensaje": "HOLA DESDE LOGIN"});
    }

    async login(req, res, next) {
        const handler = passport.authenticate('local.login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        });
        handler(req, res, next);
    }

    async edit(req, res, next) {
        return res.render('index', {"mensaje": "HOLA DESDE LOGIN"});
    }

    async update(req, res, next) {
        return res.render('index', {"mensaje": "HOLA DESDE LOGIN"});
    }

    async destroy(req, res, next) {
        let entrada;
        const nuevaEntradaDatos = {
            Id_Usuario:req.app.locals.usuario.Id_Usuario, 
            Usuario: req.app.locals.usuario.Nombre_Usuario,
            Nombre_Usuario: `${req.app.locals.usuario.Nombre} ${req.app.locals.usuario.Apellido}`, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }

        console.log(req.app.locals.usuario)
        nuevaEntradaDatos.Descripcion = "Cerro sesión";
        nuevaEntradaDatos.Tipo=1;
        entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
        req.logOut();
        return res.redirect('/login');
    }
}

module.exports = new AuthController();