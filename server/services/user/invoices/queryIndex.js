const express = require("express");
const router = express.Router();
const queryDatabase = require("../../../connectionBD/queryDatabase");
const { isAuthenticated } = require("../../functions/helpers");

router.get('/', isAuthenticated, async (req, res) => {
    const nit = req.session.name;

    if (!nit) {
        return res.status(401).json({ error: "No has iniciado sesión." });
    }

    console.log("Nit: ", nit);

    try {
        const query = `
            SELECT pagos.nit, razonsoc, factura, fecfac, fecvcto, retencion, total, fecpago, pagfac
            FROM usuarios 
            INNER JOIN pagos ON usuarios.nit = pagos.nit 
            WHERE pagos.nit = ?`;
        
        const results = await queryDatabase(query, [nit]);

        return res.json(results);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return res.status(500).json({ error: "Error al obtener los datos." }); // Respuesta de error
    }
});

module.exports = router;
