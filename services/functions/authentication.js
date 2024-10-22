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
            const [resultsUser] = await pool.query('SELECT * FROM usuarios WHERE nit = ?', [user]);
            if (resultsUser.length === 0) {
                return renderError(res, "Usuario no encontrado o contraseña incorrecta.");
            }

            const dbPassword = resultsUser[0].clave;
            const isMatch = await bcrypt.compare(password, dbPassword);
            if(isMatch){
                req.session.name = resultsUser[0].nit;
                const resultsRol = resultsUser[0].razonsoc;
                if(resultsRol === 'Administrador'){
                    return renderExit(res,'admin');
                }else{
                    return renderExit(res, 'index');
                }
            }else{
                return renderError(res, 'Usuario y/o Contraseña Invalidos.');
            }
        } catch (error) {
            console.log('error de bd', error);
            return renderError(res, "Error en la base de datos");
        }
    } else {
        return renderError(res, "Por favor, ingrese un NIT y una contraseña.");
    }
});

module.exports = router;