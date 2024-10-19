const express = require('express');
const router = express.Router();
const session = require('express-session');
const { error } = require('npmlog');
const bcrypt = require('bcrypt');
const { render } = require('ejs');

const renderError = (res, message) => {
    return res.render('login', {
        alert: true,
        alertTitle: "Error",
        alertMessage: message,
        alertIcon: "error",
        timer: 1500,
        ruta: "/"
    });
};

const renderExit = (res, ruta)=> {
    res.render('login', {
        alert: true,
        alertTitle: "Conexión Exitosa",
        alertMessage: "¡LOGIN CORRECTO!",
        alertIcon: "success",
        timer: 1500,
        ruta: ruta
    });
}

router.post('/auth', async (req, res) => {
    const user = req.body.nit;
    const password = req.body.password;
    const pool = require('../../connectionBD/db.js');

    if (user && password) {
        try {
            const [resultsUser] = await pool.query('SELECT * FROM prueba WHERE nit = ?', [user]);
            if (resultsUser.length === 0) {
                return renderError(res, "Usuario y/o contraseña inválidos.");
            }

            const dbPassword = resultsUser[0].pass;
            bcrypt.compare(password, dbPassword, (err, isMatch) => {
                if(err){
                    return renderError(res, "Error de autenticación");
                }
                if(isMatch){
                    return renderError(res, "Usuario y/o contraseña inválidos.");
                }
            });

            req.session.name = resultsUser[0].nit;
            const resultsRol  = resultsUser[0].rol;
            if(resultsRol === ('administrador')){
                return renderExit(res,'admin')
            }
            if (resultsRol === ('usuario')){
                return renderExit(res,'index')
            }
        } catch (error) {
            return renderError(res, "Error en la base de datos");
        }
    } else {
        renderError(res, "Por favor, ingrese un NIT y una contraseña.");
    }
});

module.exports = router;