const express = require("express");
const router = express.Router();
const queryDatabase = require("../../../connectionBD/queryDatabase");
const {formatDate} = require("../../functions/helpers")
const { isAuthenticated } = require('../../functions/helpers');
const {formatPesos} = require('../../functions/helpers')

router.get('/invoices',isAuthenticated, async (req, res) => {
    const nit = req.session.name;

    if (!nit) {
        return res.status(401).json({ error: "No has iniciado sesión." });
    }
    try {
        const query = `
            SELECT pagopro.nit, razonsoc, factura, fecfac, fecvcto, tot, retencion, total, fecpago, pagtot, pagfac
            FROM proveedor
            INNER JOIN pagopro ON proveedor.nit = pagopro.nit 
            WHERE pagopro.nit = ?;`;
        
        const results = await queryDatabase(query, [nit]);
        const formatedResults = results.map(result => ({ ...result,
             fecpago: formatDate(result.fecpago),
             fecfac: formatDate(result.fecfac),
             fecvcto: formatDate(result.fecvcto),
             retencion: formatPesos(result.retencion),
             total: formatPesos(result.total),
             pagfac: formatPesos(result.pagfac),
             tot: formatPesos(result.tot),
             pagtot: formatPesos(result.pagtot),
             
         }));
        return res.json(formatedResults);
    } catch (error) {
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
            SELECT pagopro.nit, razonsoc, factura, fecfac, fecvcto, retencion, tot, total, pagtot, fecpago, pagfac
            FROM proveedor
            INNER JOIN pagopro ON proveedor.nit = pagopro.nit 
            WHERE pagopro.nit = ? and fecpago is not null;`;
        
        const results = await queryDatabase(query, [nit]);
        const formatedResults = results.map(result => ({ ...result,
             fecpago: formatDate(result.fecpago),
             fecfac: formatDate(result.fecfac),
             fecvcto: formatDate(result.fecvcto),
             retencion: formatPesos(result.retencion),
             total: formatPesos(result.total),
             pagfac: formatPesos(result.pagfac),
             tot: formatPesos(result.tot),
             pagtot: formatPesos(result.pagtot),

         }));
        return res.json(formatedResults);
    } catch (error) {
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
            SELECT pagopro.nit, razonsoc, factura, fecfac, fecvcto, tot, retencion, total, pagtot, fecpago, pagfac
            FROM proveedor
            INNER JOIN pagopro ON proveedor.nit = pagopro.nit
            WHERE pagopro.nit = ? and fecpago is null;`;
        
        const results = await queryDatabase(query, [nit]);
        const formatedResults = results.map(result => ({ ...result,
             fecpago: formatDate(result.fecpago),
             fecfac: formatDate(result.fecfac),
             fecvcto: formatDate(result.fecvcto),
             retencion: formatPesos(result.retencion),
             total: formatPesos(result.total),
             pagfac: formatPesos(result.pagfac),
             tot: formatPesos(result.tot),
             pagtot: formatPesos(result.pagtot),
         }));
        return res.json(formatedResults);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener los datos." });
    }
});

module.exports = router;
