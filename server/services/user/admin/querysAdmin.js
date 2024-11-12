const express = require("express");
const router = express.Router();
const queryDatabase = require("../../../connectionBD/queryDatabase");
const {formatDate} = require("../../functions/helpers")
const { isAuthenticated } = require('../../functions/helpers');
const { roleMiddleware } = require('../../functions/helpers');

router.get("/emails", isAuthenticated, roleMiddleware('Administrador'), async (req, res) => {
    try {
        const query = `SELECT pagos.nit, factura, fecpago, usuarios.razonsoc, usuarios.correo
        FROM usuarios INNER JOIN pagos ON usuarios.nit = pagos.nit
        WHERE pagos.fecpago = CURDATE()`;
        const results = await queryDatabase(query);
        const formatedResults = results.map(result => ({ 
            ...result,
            fecpago: formatDate(result.fecpago),
        }));
        if (formatedResults.length === 0) {
            return res.status(400).json({ error: "No hay registros de envíos programados." });
        }
        return res.json(formatedResults);
    } catch (error) {
        return res.status(500).json({ error: "Error en solicitud al servidor." });
    }
});

module.exports = router;