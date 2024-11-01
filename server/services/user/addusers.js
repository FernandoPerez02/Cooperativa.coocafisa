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
            return res.status(409).json({
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
        const sql = 'INSERT INTO usuarios (nit, razonsoc, direcc, correo, telefono, celular, clave) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [nit, razsoc, direc, correo, tel, cel, hashedPassword];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                message: "Registro Exitoso.",
                redirect: '/users/register',
            });
        } else {
            return res.status(500).json({
                message: "No se pudo completar el registro. Intenta más tarde.",
                redirect: '/users/register',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "No se pudo registrar el usuario. Inténtalo de nuevo.",
            redirect: '/users/register',
        });
    }
});

module.exports = router
