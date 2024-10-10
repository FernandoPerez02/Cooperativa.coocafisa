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
/* require('./connectionBD/db'); */

//Integracion de plantillas ejs
app.get('/', (req, res)=>{
    res.render('login');
});

app.get('/index', (req, res)=>{
    const nit = req.session.name;
    if (!nit) {
        return res.redirect('/');
    }
    connection.query('SELECT * FROM usuario where nit = ?', [nit], (error, results)=> {
        if (error){
            console.log(error);
            return res.render('index', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "No hay Registros de este usuario.",
                alertIcon: "alert",
                showConfirmButton: true,
                timer: false,
                ruta: "/"
            });
        }
        function formatDate(dateString) {
            const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', options);
        }
        res.render('index', {data: results, formatDate});
    });
});

// Registrar usuarios
app.post('/register', async (req, res)=> {
});

// Autenticación de user 
app.post('/auth', async (req, res)=> {
    const user = req.body.nit;
    const password = req.body.password;
    /* let passwordhaash = await bcryptjs.hash(password, 8); */
    if(user && password){
        /* connection.query('SELECT * FROM usuario WHERE nit = ?', [user], async (error, results)=>{ */
        connection.query('SELECT * FROM usuario WHERE nit = ?', [user], (error, results)=>{
            if (error){
                console.log(error);
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error en la base de datos",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: "/"
                });
            }
            if/* (results.length === 0 || !(await bcryptjs.compare(password, results[0].password))){ */
            (results.length === 0){
                return res.render('login', {
                    alert:true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o password invalidos.",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: "/"
                });
            }// Verificar si la contraseña es correcta
               const dbPassword = results[0].password;
               console.log("Contraseña en la base de datos:", dbPassword);
               console.log("Contraseña introducida:", password);
   
               if (password !== dbPassword) {
                   console.log("Contraseña incorrecta.");
                   return res.render('login', {
                       alert: true,
                       alertTitle: "Error",
                       alertMessage: "Usuario y/o contraseña inválidos.",
                       alertIcon: "error",
                       showConfirmButton: true,
                       timer: false,
                       ruta: "/"
                   });
               } 
   
               // Si todo es correcto, iniciar sesión
               req.session.name = results[0].nit;
               console.log("Usuario autenticado con éxito:", req.session.name);
               res.render('login', {
                   alert: true,
                   alertTitle: "Conexión Exitosa",
                   alertMessage: "¡LOGIN CORRECTO!",
                   alertIcon: "success",
                   showConfirmButton: false,
                   timer: 1500,
                   ruta: ('/index')
               });
           });
    }else{
        res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor, ingrese un NIT y una contraseña.",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "/"
        });
    }
});

app.listen(3000, (req, res)=> {
    console.log ('SERVER RUNNING IN HTTP://localhost:3000');
});

