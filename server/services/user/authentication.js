const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const pool = require("../../connectionBD/db");

const router = express.Router();

const validateUser = async (nit) => {
  const [resultsUser] = await pool.query(
    "SELECT nit, clave, razonsoc FROM usuarios WHERE nit = ?",
    [nit]
  );
  return resultsUser.length > 0 ? resultsUser[0] : null;
};

router.post("/", 
  [
    body("nit").isLength({ min: 5 }).withMessage("El NIT es inválido."),
    body("password").isLength({ min: 6 }).withMessage("La contraseña es muy corta."),
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
        return res.status(401).json({ error: "Credenciales incorrectas." });
      }

      const isMatch = await bcrypt.compare(password, usuario.clave);
      if (!isMatch) {
        return res.status(401).json({ error: "Credenciales incorrectas." });
      }

      req.session.name = usuario.nit;
      console.log('Sesión activa:', req.session);

      const redirectPath = usuario.razonsoc === "Administrador"
        ? `/prueba`
        : "/home/suppliers";

      return res.status(200).json({
        message: "¡LOGIN CORRECTO!",
        redirect: redirectPath,
      });
    } catch (error) {
      console.error("Error en el servidor", error);
      return res.status(500).json({ error: "Error en el servidor. Intenta nuevamente más tarde." });
    }
  }
);

module.exports = router;
