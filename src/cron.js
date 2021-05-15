const cron = require('node-cron');
const notifier = require('node-notifier');
const nodemailer = require('nodemailer');
const { Sequelize, Parametros, Equipos} = require('./models');

async function NodeMail(){
  try {
    let parametros = await Parametros.findOne({raw:true, where:{
      Id_Parametros: 1
    }})
  
    let mail = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: parametros.Email,
        pass: parametros.Password
      }
    });

    let mailOptions = {}
    mailOptions.from =  parametros.Email;
    mailOptions.to= parametros.Notificar;
    mailOptions.subject = "Notificación de estado de equipo"
    let equipos = await Equipos.findAll({raw:true});
    let band = false;
    equipos.forEach(equipo => {
    let porcentaje = parseFloat(equipo.Tiempo_Restante_Porcentaje)
    if(equipo.Estado === 1) {
    // if(porcentaje >= 75.0){
    //   mailOptions.text = `El equipo ${equipo.Nombre} se encuentra en Optimas condiciones, con un Tiempo de vida de ${equipo.Tiempo_Restante} horas restantes, el equipo se encuentra al ${equipo.Tiempo_Restante_Porcentaje}% de su vida util 
    //   `
    // }else 
      if(porcentaje<75.0) {
        band = true;
        mailOptions.text = `El equipo ${equipo.Nombre} necesita mantenimiento, tiene un Tiempo de vida de ${equipo.Tiempo_Restante} horas restantes, el equipo se encuentra al ${equipo.Tiempo_Restante_Porcentaje}% de su vida util 
        `
      }else if(porcentaje<50.0){
        band = true;
        mailOptions.text = `El equipo ${equipo.Nombre} necesita mantenimiento urgentemente, tiene un Tiempo de vida de ${equipo.Tiempo_Restante} horas restantes, el equipo se encuentra al ${equipo.Tiempo_Restante_Porcentaje}% de su vida util 
        `
      }else if(porcentaje<25.0) {
        band = true;
        mailOptions.text = `El equipo ${equipo.Nombre} necesita ser reemplazado urgentemente, tiene un Tiempo de vida de ${equipo.Tiempo_Restante} horas restantes, el equipo se encuentra al ${equipo.Tiempo_Restante_Porcentaje}% de su vida util 
        `
      }

      if(band) {
        mail.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email enviado: ' + info.response);
          }
        });

        band = false;
      }
    
      band=false;
    }

    })
  }catch(error) {
    console.log(error)
  }
}

NodeMail();

cron.schedule('0 */1 * * * *',() => {
  console.log('running every minute ');
  NodeMail();
});