const express = require('express');
const router = express.Router();
const session = require('express-session');

const renderError = (res, message) => {
    return res.render('login', {
        alert: true,
        alertTitle: "Error",
        alertMessage: message,
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "/"
    });
};

const renderExit = (res, ruta)=> {
    res.render('login', {
        alert: true,
        alertTitle: "Conexión Exitosa",
        alertMessage: "¡LOGIN CORRECTO!",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: ruta
    });
}

router.post('/auth', async (req, res) => {
    const user = req.body.nit;
    const password = req.body.password;
    const pool = require('../connectionBD/db.js');

    if (user && password) {
        pool.query('SELECT * FROM administrador WHERE userr = ?', [user], (errorAdmin, resultsAdmin) => {
            if (errorAdmin) {
                return renderError(res, "Error en la base de datos");
            }

            if (resultsAdmin.length > 0) {
                const dbPassword = resultsAdmin[0].pass;
                if (password !== dbPassword) {
                    return renderError(res, "Usuario y/o contraseña inválidos.");
                }

                req.session.name = resultsAdmin[0].userr;
                return renderExit(res, 'admin')
            }

            pool.query('SELECT * FROM usuario WHERE nit = ?', [user], (errorUser, resultsUser) => {
                if (errorUser) {
                    return renderError(res, "Error en la base de datos");
                }

                if (resultsUser.length === 0) {
                    return renderError(res, "Usuario y/o contraseña inválidos.");
                }

                const dbPassword = resultsUser[0].password;
                if (password !== dbPassword) {
                    return renderError(res, "Usuario y/o contraseña inválidos.");
                }

                req.session.name = resultsUser[0].nit;
                return renderExit(res,'index')
            });
        });
    } else {
        renderError(res, "Por favor, ingrese un NIT y una contraseña.");
    }
});

module.exports = router;

