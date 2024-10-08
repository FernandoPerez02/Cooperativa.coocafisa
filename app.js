const express = require('express');
const app = express();
const path = require('path');

// Es para capturar los datos del formulario 
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

// Usamos a bcryptjs
const bcryptjs = require('bcryptjs');

// var de sesion
const session = require ('express-session');
const connection = require('./connectionBD/db');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:false
}));

// Invocar la conexion a la base de datos
require('./connectionBD/db');

//Integracion de plantillas ejs
app.get('/', (req, res)=>{
    res.render('login');
});

app.get('/index', (req, res)=>{
    res.render('index');
});

// Registrar usuarios
app.post('/register', async (req, res)=> {
});

// Autenticación de user 
app.post('/auth', async (req, res)=> {
    const user = req.body.nit;
    const password = req.body.password;
    let passwordhaash = await bcryptjs.hash(password, 8);
    if(user && password){
        connection.query('SELECT * FROM usuario WHERE nit = ?', [user], async (error, results)=>{
            if(results && results.length == 0 || !(await bcryptjs.compare(password, results[0].password))){
                res.render('login', {
                    alert:true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o password invalidos.",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: "login"
                });
            }else{
                req.session.name = results[0].nit
                res.render('login', {
                    alert:true,
                    alertTitle: "Conexion Exitosa.",
                    alertMessage: "¡LOGIN CORRECTO!",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });

            }
        })
    }else{
        res.send('Por favor ingrese un nit y una password')
    }
});

app.listen(3000, (req, res)=> {
    console.log ('SERVER RUNNING IN HTTP://localhost:3000');
})