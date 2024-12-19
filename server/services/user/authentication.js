const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const pool = require("../../connectionBD/db");
const moment = require('moment');
const jwt = require('jsonwebtoken');
const router = express.Router();

const validateeUser = async (nit) => {
  const [resultUser] = await pool.query(`
    SELECT proveedor.proveedor_id, nit, clave, rol, users, intentos_fallidos, cambiar_password, fecha_pass FROM
    usuario INNER JOIN proveedor ON usuario.proveedor_id = proveedor.proveedor_id WHERE nit = ?`, [nit]);
  return resultUser.length > 0 ? resultUser[0] : null;
  }

function generateTokenValidation (user) {
    const payload = {
        name: user.nit,
        role: user.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
    
}

router.post('/login',
  [
    body("nit").isLength({ min: 5 }).withMessage("Una de las credenciales ingresadas no es correcta."),
    body("password").isLength({ min: 6 }).withMessage("Una de las credenciales ingresadas no es correcta."),
  ],
   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nit, password } = req.body;

    try {
      const usuario = await validateeUser(nit);
      if (!usuario) {
        return res.status(401).json({ errors: "Credenciales incorrectas.", redirect: "/" });
      }

      if (usuario.cambiar_password) {
        return res.status(403).json({
          errors: "Debe cambiar su contraseña antes de iniciar sesión.",
          redirect: `/users/resetpassword`,
        });
      }

      const dateRegister = moment(usuario.fecha_pass);
        const dateLimit = moment().subtract(30, "days");
        if(dateRegister.isBefore(dateLimit)) {
          return res.status(403).json({ errors: "Tu contraseña expiro. Debes cambiar tu contraseña.",
             redirect: `/users/resetpassword` });
        }

      const isMatch = await bcrypt.compare(password, usuario.clave);
      if (!isMatch) {
        const updatedIntentos = usuario.intentos_fallidos + 1;

      await pool.query(
          "UPDATE usuario SET intentos_fallidos = ? WHERE proveedor_id = ?", 
          [ updatedIntentos, usuario.proveedor_id ]
        );

        if (updatedIntentos >= 3) {
          await pool.query("UPDATE usuario SET cambiar_password = TRUE WHERE proveedor_id = ?",
            [usuario.proveedor_id]);
          return res.status(403).json({
            errors: "Ha alcanzado el límite de intentos fallidos. Debe cambiar su contraseña.",
            redirect: `/users/resetpassword`,
          });
        }
        return res.status(401).json({ errors: "Credenciales incorrectas.", redirect: "/" });
      }

      await pool.query("UPDATE usuario SET intentos_fallidos = 0 WHERE proveedor_id = ?", [usuario.proveedor_id]);

      const token = generateTokenValidation(usuario);
      const redirectPath = usuario.rol === "Administrador"
        ? `/home`
        : "/home/suppliers/invoices";
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 10,
        })
        res.status(200).json({ redirect: redirectPath });
    } catch (error) {
      return res.status(500).json({ errors: "Error en el servidor. Inténtalo de nuevo más tarde.", redirect: "/" });
    }
  });

  module.exports = router;