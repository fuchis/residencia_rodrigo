const { Usuarios } = require('../models');
const helpers = require('../middlewares/helpers');
const userService = {};

userService.RegisterUser = async (usuario) => {
    const nuevoUsuario = usuario;
    console.log(usuario)

    nuevoUsuario.Pass = await helpers.encryptPassword(nuevoUsuario.Pass);

    return Usuarios.create(nuevoUsuario);
    
};


userService.HashPassword = async (pass) => {
    let HashPass = await helpers.encryptPassword(pass);
    return HashPass;
};

userService.test = "Hola";

module.exports = userService;