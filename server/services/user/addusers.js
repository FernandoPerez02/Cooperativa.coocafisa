const express = require('express');
const router = express.Router();
const pool = require('../../connectionBD/db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { nit, razsoc, direc, correo, tel, cel, pass, passcon } = req.body;

    try {
        if (!nit || !razsoc || !correo || !pass || !passcon) {
            return res.status(400).json({
                message: "Estos campos son obligatorios.",
                redirect: '/users/register',
                errors: {
                    nit: !nit,
                    razsoc: !razsoc,
                    correo: !correo,
                    pass: !pass,
                    passcon: !passcon,
                },
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({
                message: "Formato de correo electrónico inválido.",
                redirect: '/users/register',
            });
        }

        const [regusuario] = await pool.query('SELECT nit FROM usuarios WHERE nit = ?', [nit]);
        if (regusuario.length > 0) {
            return res.status(401).json({
                message: "Este usuario ya posee una cuenta.",
                redirect: '/users/register',
            });
        }

        if (pass !== passcon) {
            return res.status(400).json({
                message: "La contraseña no coincide.",
                redirect: '/users/register',
            });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        const fecha_password = new Date();
        const sql = 'INSERT INTO usuarios (nit, razonsoc, direcc, correo, telefono, celular, clave, fecha_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nit, razsoc, direc, correo, tel, cel, hashedPassword, fecha_password];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                message: "Registro Exitoso.",
                redirect: '/users/register',
            });
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error en el servidor. Inténtalo de nuevo más tarde.",
            redirect: '/users/register',
        });
    }
});

module.exports = router
