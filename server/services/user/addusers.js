const express = require('express');
const router = express.Router();
const pool = require('../../connectionBD/db');
const bcrypt = require('bcrypt');
const { roleMiddleware } = require('./authMiddleware');

router.post('/newUser', roleMiddleware('Administrador'), async (req, res) => {
    const { nit, rol, pass, passcon } = req.body;
    try {
        const [regusuario] = await pool.query(`SELECT nit, proveedor.proveedor_id FROM usuario
            inner join proveedor on proveedor.proveedor_id = usuario.proveedor_id 
            WHERE nit = ?`, [nit]);
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
        const [proveedor] = await pool.query(`SELECT proveedor_id FROM proveedor WHERE nit = ?`, [nit]);
        if (proveedor.length === 0) {
            return res.status(404).json({
                message: "No hay proveedor con el nit ingresado.",
                redirect: '/users/register',
            });
        }
        const proveedorId = proveedor[0].proveedor_id;
        const sql = 'INSERT INTO usuario (rol, proveedor_id, clave, fecha_pass, intentos_fallidos = 0, cambiar_password = 0) VALUES (?, ?, ?, ?)';
        const values = [rol, proveedorId, hashedPassword, fecha_password];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                message: "Registro Exitoso.",
                redirect: '/users/register',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor. Inténtalo de nuevo más tarde.",
            redirect: '/users/register',
        });
    }
});

module.exports = router
