/* const express = require('express');
const router = express.Router();
const pool = require('../../connectionBD/db');
const bcrypt = require('bcrypt');

const renderAlert = (res, alertTitle, alertMessage, alertIcon, timer, ruta, plantilla) => {
    res.render(plantilla, {
        alert: true,
        alertTitle: alertTitle,
        alertMessage: alertMessage,
        alertIcon: alertIcon,
        timer: timer,
        ruta: ruta,
        plantilla: plantilla
    });
};

router.post ('/register', async (req, res) =>{
    const {nit, razsoc, direc, correo, tel, cel, pass, passcon} = req.body;

    try{
        if (!nit || !razsoc || !correo || !pass || !passcon){
            return renderAlert(res, 'Error', 'Estos campos son obligatorios.', 'alert', 200, 'reguser', 'registerUser');
        }

        if (pass !== passcon) {
            return renderAlert(res,'Error', 'La contraseña no coicide.' , 'alert', 200, 'reguser', 'registerUser');
        }
        const hashedPassword = await bcrypt.hash(pass, 10);
        const sql = 'INSERT INTO usuarios (nit, razonsoc, direcc, correo, telefono, celular, clave) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [nit, razsoc, direc, correo, tel, cel, hashedPassword];

        await pool.query(sql,values, (error, results) =>{
            if(error){
                return renderAlert(res, 'Error', 'Error en el registro. Intentalo mas tarde.', 'alert', 200, 'reguser', 'registerUser');
            }

            if(results.length > 0){
                return renderAlert(res, 'Error', 'Registro Exitoso', 'success', 200, 'reguser', 'registerUser')
            }
        });
    }catch{
        return renderAlert(res, 'No se pudo registrar el usuario. Intentalo de nuevo.' )
    }
});

module.exports = router */

const express = require('express');
const router = express.Router();
const pool = require('../../connectionBD/db');
const bcrypt = require('bcrypt');

const renderAlert = (res, alertTitle, alertMessage, alertIcon, timer, ruta, plantilla) => {
    res.render(plantilla, {
        alert: true,
        alertTitle,
        alertMessage,
        alertIcon,
        timer,
        ruta,
        plantilla
    });
};

router.post('/register', async (req, res) => {
    const { nit, razsoc, direc, correo, tel, cel, pass, passcon } = req.body;

    try {
        const [regusuario] = await pool.query('SELECT nit FROM usuarios WHERE nit = ?', [nit]);
        if(regusuario.length > 0){
            return renderAlert(res, 'Error', 'Este usuario ya posee una cuenta.', 'error', 2000, 'reguser', 'registro');
        }

        if (!nit || !razsoc || !correo || !pass || !passcon) {
            return renderAlert(res, 'Error', 'Estos campos son obligatorios.', 'error', 2000, 'reguser', 'registro');
        }
        if (pass !== passcon) {
            return renderAlert(res, 'Error', 'La contraseña no coincide.', 'error', 2000, 'reguser', 'registro');
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(pass, 10);
        const sql = 'INSERT INTO usuarios (nit, razonsoc, direcc, correo, telefono, celular, clave) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [nit, razsoc, direc, correo, tel, cel, hashedPassword];

        // Ejecutar la consulta
        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return renderAlert(res, 'Éxito', 'Registro exitoso.', 'success', 2000, 'reguser', 'registro');
        } else {
            return renderAlert(res, 'Error', 'No se pudo completar el registro.', 'error', 2000, 'reguser', 'registro');
        }
    } catch (error) {
        console.error(error);
        return renderAlert(res, 'Error', 'No se pudo registrar el usuario. Inténtalo de nuevo.', 'error', 2000, 'reguser', 'registro');
    }
});

module.exports = router;
