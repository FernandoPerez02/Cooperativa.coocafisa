const express = require("express");
const router = express.Router();
const queryDatabase = require("../../../connectionBD/queryDatabase");
const { roleMiddleware } = require("../authMiddleware");

router.get("/users", roleMiddleware('Administrador'), async (req, res) => {
    try {
        const query = `SELECT nit, rol, razonsoc, fecha_reg, correo FROM usuario
         inner join proveedor on proveedor.proveedor_id = usuario.proveedor_id`;
        const results = await queryDatabase(query);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: "Falla en el servidor. Intenta de nuevo mas tarde." });
    }
});

module.exports = router;