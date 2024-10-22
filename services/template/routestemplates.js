const express = require('express');
const router = express.Router();
const {isAuthenticated, formatDate, queryDatabase, paginator} = require('../functions/globalfunctions')

router.get('/resetpassword', (req, res) =>{
    res.render('reset_password');
});

router.get('/reste', (req, res) => {
    res.render('resetform');
});

router.get('/', (req, res)=>{
    res.render('login');
});

router.get('/admin', isAuthenticated, async (req, res) => {
    const itemsPerPage = 6;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    const countQuery = `SELECT COUNT(*) AS total FROM usuario WHERE fecha_pago = CURDATE()`;
    const dataQuery = `
        SELECT *
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

router.get('/index',isAuthenticated, async (req, res) => {
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
            showConfirmButton: false,
            timer: false,
            ruta: "/"
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
});

router.get('/reguser', (req, res) => {
    res.render('registro');
});

module.exports = router;