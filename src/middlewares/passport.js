const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { Usuarios } = require("../models");
const helpers = require('../middlewares/helpers');
const dateTimeService  = require('../services/dateTime.service');
const bitacoraService = require('../services/bitacora.service');

passport.use('local.login', new LocalStrategy({
    usernameField: 'Nombre_Usuario',
    passwordField: 'Pass',
    passReqToCallback: true
}, async (req, username, password, done) => {
    let entrada;
        let nuevaEntradaDatos = {
            Id_Usuario: null, 
            Usuario: null,
            Nombre_Usuario: null, 
            Descripcion: null, 
            Fecha: await dateTimeService.getTimeIsoFormat()
        }
    
   
        const usuario = await Usuarios.findOne({raw:true,
            where: {
                Nombre_Usuario: username
            }
        })
     
        
        if(usuario){
            const valid_password = await bcrypt.compare(password, usuario.Pass);
            nuevaEntradaDatos = {
                Id_Usuario: usuario.Id_Usuario, 
                Usuario: usuario.Nombre_Usuario,
                Nombre_Usuario: `${usuario.Nombre} ${usuario.Apellido}`, 
                Descripcion: null, 
                Fecha: await dateTimeService.getTimeIsoFormat()
            }
            if(valid_password){
                if(usuario.Estado===0){
                    nuevaEntradaDatos.Descripcion = `Usuario deshabilitado porfavor contacte con el Administrador`;
                    nuevaEntradaDatos.Tipo=5;
                    try{
                        entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
                    }catch(error) {
                        console.log(error)
                    }
                    
                    return done(null, false, req.flash('message', 'Usuario deshabilitado porfavor contacte con el Administrador'));
                }
                nuevaEntradaDatos.Descripcion = `Usuario: ${usuario.Nombre_Usuario} Inicio Sesión`;
                nuevaEntradaDatos.Tipo=1;
                try{
                    entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
                }catch(error) {
                    console.log(error)
                }
                return done(null, usuario, req.flash('success', 'Bienvenido ' + usuario.Nombre));
            }else {
                
                nuevaEntradaDatos.Descripcion = `Contraseña invalida del usuario: ${usuario.Nombre_Usuario}`;
                nuevaEntradaDatos.Tipo=5;
                try{
                    entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
                }catch(error) {
                    console.log(error)
                }
                return done(null, false, req.flash('message', 'Contrasenia Invalida'));
            }
            
        }else {
            nuevaEntradaDatos.Descripcion = `Nombre de usuario no existe`;
            nuevaEntradaDatos.Tipo=5;
            try{
                entrada = await bitacoraService.RegistrarEntrada(nuevaEntradaDatos); 
            }catch(error) {
                console.log(error)
            }
            return done(null, false, req.flash("message","Nombre de usuario no exite"))
        }

    

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'Nombre_Usuario',
    passwordField: 'Pass',
    passReqToCallback: true
}, async( req, username, password, done) => {

    const {Nombre, Apellido, Tipo, Estado, Telefono} = req.body;
    const nuevoUsuario = {
        Nombre_Usuario: username,
        Nombre,
        Apellido,
        Tipo,
        Pass: password,
        Estado,
        Telefono
    }
    
    helpers.encryptPassword(password).then(pass => {
        nuevoUsuario.Pass = pass;
        Usuarios.create(nuevoUsuario).then(resultado => {
            nuevoUsuario.Id_Usuario = resultado.Id_Usuario;
            return done(null, nuevoUsuario);
        }).catch(error => console.log(error));;
    }).catch(error => console.log(error));
    
}));

passport.serializeUser((user, done) => {
    return done(null, user.Id_Usuario);
});

passport.deserializeUser((async (id, done) => {
 
    const usuario = await Usuarios.findOne({
        where: {
            Id_Usuario: id
        }
    }).then(usuario => done(null, usuario))

}))