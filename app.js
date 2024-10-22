const express = require('express');
const app = express();
const path = require('path');

//Capturar los datos del formulario 
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Definir direcciones de las variables de entorno.
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

// Definir el directorio de los archivos estaticos (plantilas y estilo).
app.use('/resources', express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'public', 'views'));

// Motor de platillas
app.set('view engine', 'ejs');


// var de sesion
const session = require ('express-session');
const {emailscheduler} = require('./services/email/emailscheduler');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000 * 60 * 5 
    }
}));

// Ruta para validación del login
const authRoutes = require('./services/functions/authentication'); 
app.use(authRoutes);

//Ruta de las plantillas.
const routestemplate = require('./services/template/routestemplates');
app.use('/', routestemplate);

// Recuperar contraseña.
const resetPassword = require('./services/functions/resetPassword');
app.use('/', resetPassword);

const registerUser = require('./services/functions/registerUser');
app.use('/', registerUser);

app.listen(3000, (req, res)=> {
    console.log ('SERVER RUNNING IN HTTP://localhost:3000');
});