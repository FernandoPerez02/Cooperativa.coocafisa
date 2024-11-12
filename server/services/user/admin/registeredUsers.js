const express = require("express");
const router = express.Router();
const queryDatabase = require("../../../connectionBD/queryDatabase");
const { isAuthenticated } = require('../../functions/helpers');

router.get("/users", async (req, res) => {
    try {
        const query = "SELECT nit, razonsoc, direcc, correo, celular, telefono, fecha_reg FROM usuarios";
        const results = await queryDatabase(query);
        return res.json(results);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return res.status(500).json({ error: "Error al obtener los usuarios." });
    }
});

module.exports = router;