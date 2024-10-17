const express = require('express');
const app = express();
const path = require('path');
const bcryptjs = require('bcryptjs');

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
const pool = require('./connectionBD/db');
const {emailscheduler} = require('./services/emailscheduler');
const { formatDate } = require('./services/globalfunctions');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000 * 60 * 5 
    }
}));

const isAuthenticated = (req, res, next) => {
    if (req.session.name) {
        return next();
    }
    res.redirect('/');
};

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
});

const authRoutes = require('./services/authentication'); 
app.use(authRoutes);

const queryDatabase = async (query, params) => {
    const connection = await pool.promise().getConnection();
    try {
        const [results] = await connection.query(query, params);
        return results;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error.message, { query, params });
        throw new Error(`Error en la consulta a la base de datos: ${error.message}`);
    } finally {
        connection.release();
    }
};

//Integracion de plantillas ejs
app.get('/', (req, res)=>{
    res.render('login');
});

app.get('/admin', isAuthenticated, async (req, res) => {
    const itemsPerPage = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    const countQuery = `SELECT COUNT(*) AS total FROM usuario WHERE fecha_pago = CURDATE()`;
    const dataQuery = `
        SELECT nit, empresa, descuento, retencion, pago, fecha_pago, email 
        FROM usuario 
        WHERE fecha_pago = CURDATE() 
        LIMIT ? OFFSET ?`;

        try{
            const countResult = await queryDatabase(countQuery);
            const totalItems = countResult[0].total;
            const pagination = paginator(totalItems, currentPage, itemsPerPage);

            const results = await queryDatabase(dataQuery, [itemsPerPage, offset]);
            res.render('admin', {data: results, pagination, formatDate});
        } catch (err){
            return res.status(500).send('Error en el servidor');
        }
    });

app.get('/reporte', isAuthenticated, async (req, res)=> {
    res.render('reporte');
})

app.get('/index',isAuthenticated, async (req, res) => {
    const nit = req.session.name;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 6;
    const offset = (page - 1) * itemsPerPage;

    try{
        const query = 'SELECT * FROM usuario WHERE nit = ? LIMIT ?, ?';
        const results = await queryDatabase( query, [nit, offset, itemsPerPage]);

        const countQuery = 'SELECT COUNT(*) AS total FROM usuario WHERE nit = ?';
        const countResult = await queryDatabase(countQuery, [nit]);
        const totalItems = countResult[0].total;
        const pagination = paginator(totalItems, page, itemsPerPage);

        res.render('index', { 
            data: results, 
            pagination, 
            formatDate 
        });
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
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

app.listen(3000, (req, res)=> {
    console.log ('SERVER RUNNING IN HTTP://localhost:3000');
});