const express = require('express');
const app = express();
const path = require('path');
const bcryptjs = require('bcryptjs');
const emailScheduler = require('./services/emailscheduler');

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
const connection = require('./connectionBD/db');
const obtainData = require('./services/emailscheduler');
const { formatDate } = require('./services/globalfunctions');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:false
}));

//Integracion de plantillas ejs
app.get('/', (req, res)=>{
    res.render('login');
});

app.get('/admin', (req, res) => {
    const itemsPerPage = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    const countQuery = `SELECT COUNT(*) AS total FROM usuario WHERE fecha_pago = CURDATE()`;
    const dataQuery = `
        SELECT nit, empresa, descuento, retencion, pago, fecha_pago, email 
        FROM usuario 
        WHERE fecha_pago = CURDATE() 
        LIMIT ${itemsPerPage} OFFSET ${offset}`;
  
    connection.query(countQuery, (err, countResult) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }

        const totalItems = countResult[0].total;
        const pagination = paginator(totalItems, currentPage, itemsPerPage);

        connection.query(dataQuery, (err, results) => {
            if (err) {
                return res.status(500).send('Error en el servidor');
            }

            res.render('admin', { data: results, pagination, formatDate });
        });
    });
});

app.get('/reporte', (req, res)=> {
    res.render('reporte');
})

app.get('/index', (req, res) => {
    const nit = req.session.name;
    if (!nit) {
        return res.redirect('/');
    }

    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 6;
    const offset = (page - 1) * itemsPerPage;

    const query = 'SELECT * FROM usuario WHERE nit = ? LIMIT ?, ?';
    connection.query(query, [nit, offset, itemsPerPage], (error, results) => {
        if (error) {
            return res.render('index', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "No hay registros de este usuario.",
                alertIcon: "alert",
                showConfirmButton: true,
                timer: false,
                ruta: "/"
            });
        }

        const countQuery = 'SELECT COUNT(*) AS total FROM usuario WHERE nit = ?';
        connection.query(countQuery, [nit], (err, countResult) => {
            if (err) {
                return res.redirect('/');
            }

            const totalItems = countResult[0].total;
            const pagination = paginator(totalItems, page, itemsPerPage);

            res.render('index', { 
                data: results, 
                pagination, 
                formatDate 
            });
        });
    });
});

function paginator(totalItems, currentPage = 1, itemsPerPage = 6) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
        totalItems,
        currentPage,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
    };
};


app.post('/auth', async (req, res)=> {
    const user = req.body.nit;
    const password = req.body.password;
    if(user && password){
        connection.query('SELECT * FROM usuario WHERE nit = ?', [user], (error, results)=>{
            if (error){
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
            if
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
            }
               const dbPassword = results[0].password;   
               if (password !== dbPassword) {
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

               if (user === '103364698'){
                return res.redirect('admin')
               }
               req.session.name = results[0].nit;
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

