const express = require("express");
const router = express.Router();
const queryDatabase = require("../../../connectionBD/queryDatabase");
const {formatDate} = require("../../functions/helpers")
const { isAuthenticated } = require('../../functions/helpers');

router.get('/invoices',isAuthenticated, async (req, res) => {
    const nit = req.session.name;

    if (!nit) {
        return res.status(401).json({ error: "No has iniciado sesión." });
    }
    try {
        const query = `
            SELECT pagos.nit, razonsoc, factura, fecfac, fecvcto, retencion, total, fecpago, pagfac
            FROM usuarios 
            INNER JOIN pagos ON usuarios.nit = pagos.nit 
            WHERE pagos.nit = ?;`;
        
        const results = await queryDatabase(query, [nit]);
        const formatedResults = results.map(result => ({ ...result,
             fecpago: formatDate(result.fecpago),
             fecfac: formatDate(result.fecfac),
             fecvcto: formatDate(result.fecvcto),
         }));
        return res.json(formatedResults);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return res.status(500).json({ error: "Error al obtener los datos." });
    }
});

router.get('/invoicepayment', isAuthenticated, async (req, res) => {
    const nit = req.session.name;

    if (!nit) {
        return res.status(401).json({ error: "No has iniciado sesión." });
    }
    try {
        const query = `
            SELECT pagos.nit, razonsoc, factura, fecfac, fecvcto, retencion, total, fecpago, pagfac
            FROM usuarios 
            INNER JOIN pagos ON usuarios.nit = pagos.nit 
            WHERE pagos.nit = ? and pagos.fecpago is not null;`;
        
        const results = await queryDatabase(query, [nit]);
        const formatedResults = results.map(result => ({ ...result,
             fecpago: formatDate(result.fecpago),
             fecfac: formatDate(result.fecfac),
             fecvcto: formatDate(result.fecvcto),
         }));
        return res.json(formatedResults);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return res.status(500).json({ error: "Error al obtener los datos." });
    }
});

router.get('/invoicepending', isAuthenticated, async (req, res) => {
    const nit = req.session.name;

    if (!nit) {
        return res.status(401).json({ error: "No has iniciado sesión." });
    }
    try {
        const query = `
            SELECT pagos.nit, razonsoc, factura, fecfac, fecvcto, retencion, total, fecpago, pagfac
            FROM usuarios 
            INNER JOIN pagos ON usuarios.nit = pagos.nit 
            WHERE pagos.nit = ? and pagos.fecpago is null;`;
        
        const results = await queryDatabase(query, [nit]);
        const formatedResults = results.map(result => ({ ...result,
             fecpago: formatDate(result.fecpago),
             fecfac: formatDate(result.fecfac),
             fecvcto: formatDate(result.fecvcto),
         }));
        return res.json(formatedResults);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return res.status(500).json({ error: "Error al obtener los datos." });
    }
});

module.exports = router;