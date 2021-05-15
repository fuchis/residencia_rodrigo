const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const hbs = require('express-handlebars');
const path = require('path');
const { PORT } = require("./config");
const { HomeRoutes, AuthRoutes, ProfileRoutes, UserRoutes, ItemsRoutes, PrestamosRoutes,BitacoraRoutes, SistemaRoutes } = require('./routes');
const passport = require("passport");
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];
const options = { host: config.host, port: config.port, user: config.username, password: config.password, database: config.database };
const sessionStore = new MySQLStore(options);
const createLocaleMiddleware = require('express-locale');
const moment = require('moment'); // require

// Inicializaciones
const app = express();
require('./middlewares/passport');
// Middlewares
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use(createLocaleMiddleware({
    "priority": ["accept-language", "default"],
    "default": "es-MX"
  }))


const viewsPath = path.join(__dirname, './views') 
app.set('views',viewsPath);

app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        timeago: function(savedTimestamp) {
            let mx = moment(savedTimestamp);
            return mx.tz("America/Merida").format('DD/MM/YYYY hh:mm:ss');
           
        },
        horas: function(tiempo) {
            return tiempo.split(':')[0];
        },
        estado: function(estado) {
            if(estado==="P") {
                return "Prestado"
            }else if(estado==="R") {
                return "Reservado"
            }else {
                return estado;
            }
        },
        detalles: function(estado) {
            if(estado==="P") {
                return true; 
            }else if(estado==="R") {
                return false;
            }
        },
        detallesPR: function(estado) {
            if(estado==="P" || estado === "R") {
                return true;
            }else {
                return false;
            }
        }
    }
  }))

app.set('view engine', '.hbs');


app.use(session({ secret: 'residenciaTecnologico', resave: false, saveUninitialized: false, store: sessionStore }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.usuario = req.user;
    if(req.user){
        app.locals.usuario = req.user.dataValues;
        if(app.locals.usuario.Tipo === 1) {
            app.locals.usuario.Admin=true;
        }else if(app.locals.usuario.Tipo === 2) {
            app.locals.usuario.Servicio=true;
        }else{
            app.locals.usuario.Maestro=true;
        }
        
    }      
    next();
});

// rutas
app.use(AuthRoutes);
//app.use(HomeRoutes);
app.use(ProfileRoutes);
app.use(UserRoutes);
app.use(ItemsRoutes);
app.use(PrestamosRoutes);
app.use(BitacoraRoutes);
app.use(SistemaRoutes);
// Listener

process.env.TZ = 'America/Mexico' // here is the magical line

let server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.setTimeout(1500000);
