const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const pool = require("../../connectionBD/db");
const moment = require('moment');

const router = express.Router();

const validateUser = async (nit) => {
  const [resultsUser] = await pool.query(
    "SELECT * FROM usuarios WHERE nit = ?",
    [nit]
  );
  return resultsUser.length > 0 ? resultsUser[0] : null;
};

router.post("/", 
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
      const usuario = await validateUser(nit);
      if (!usuario) {
        return res.status(401).json({ errors: "Credenciales incorrectas.", redirect: "/" });
      }

      if (usuario.debe_cambiar_password) {
        return res.status(403).json({
          errors: "Debe cambiar su contraseña antes de iniciar sesión.",
        });
      }

      const isMatch = await bcrypt.compare(password, usuario.clave);
      if (!isMatch) {

        const dateRegister = moment(usuario.fecha_password);
        const dateLimit = moment().subtract(30, "days");
        if(dateRegister.isBefore(dateLimit)){
          return res.status(403).json({ errors: "Tu contraseña expiro. Debes cambiar tu contraseña.", redirect: "/users/resetpassword/formpass" });
        }
        const [updateResult] = await pool.query(
          "UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1 WHERE nit = ?", 
          [nit]
        );

        const [updatedUser] = await pool.query(
          "SELECT intentos_fallidos FROM usuarios WHERE nit = ?", 
          [nit]
        );
        const updatedIntentos = updatedUser[0]?.intentos_fallidos || 0;

        if (updatedIntentos >= 3) {
          await pool.query("UPDATE usuarios SET debe_cambiar_password = TRUE WHERE nit = ?", [nit]);
          return res.status(403).json({
            errors: "Ha alcanzado el límite de intentos fallidos. Debe cambiar su contraseña.",
          });
        }
        return res.status(401).json({ errors: "Credenciales incorrectas.", redirect: "/" });
      }

      await pool.query("UPDATE usuarios SET intentos_fallidos = 0 WHERE nit = ?", [nit]);

      req.session.name = usuario.nit;
      console.log('Sesión activa:', req.session);

      const redirectPath = usuario.razonsoc === "Administrador"
        ? `/home`
        : "/home/suppliers";

      return res.status(200).json({
        message: "¡LOGIN CORRECTO!",
        redirect: redirectPath,
      });
    } catch (error) {
      console.error("Error en el servidor", error);
      return res.status(500).json({ errors: "Error en el servidor. Intenta nuevamente más tarde.", redirect: "/" });
    }
  }
);

module.exports = router;