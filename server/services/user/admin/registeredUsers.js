const express = require("express");
const router = express.Router();
const queryDatabase = require("../../../connectionBD/queryDatabase");
const { isAuthenticated } = require('../../functions/helpers');

router.get("/users", isAuthenticated, async (req, res) => {
    try {
        const query = "SELECT nit, razonsoc, direcc, correo, celular, telefono, fecha_reg FROM usuarios";
        const results = await queryDatabase(query);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: "Falla en el servidor. Intenta de nuevo mas tarde." });
    }
});

module.exports = router;