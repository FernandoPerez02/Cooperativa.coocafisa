const express = require("express");
const router = express.Router();
const queryDatabase = require("../../../connectionBD/queryDatabase");
const {formatDate} = require("../../functions/helpers")
const { isAuthenticated } = require('../../functions/helpers');
const { roleMiddleware } = require('../../functions/helpers');
const { formatPesos } = require("../../functions/helpers");

router.get("/emails", isAuthenticated, roleMiddleware('Administrador'), async (req, res) => {
    try {
        const query = `SELECT pagopro.nit, factura, str_to_Date(fecpago, '%e-%b-%y') AS fecpago, razonsoc, correo
        FROM proveedor INNER JOIN pagopro ON proveedor.nit = pagopro.nit
        WHERE str_to_Date(fecpago, '%e-%b-%y') = CURDATE()`;
        const results = await queryDatabase(query);
        const formatedResults = results.map(result => ({ 
            ...result,
            fecpago: formatDate(result.fecpago),
        }));
        return res.json(formatedResults);
    } catch (error) {
        return res.status(500).json({ error: "Error en la solicitud al servidor. Intenta de nuevo mas tarde." });
    }
});

router.get('/suppliers', async (req, res) => {
    try {
        const query = 'SELECT nit, razonsoc, direcc, correo, telefono, celular, fecha_registro FROM proveedor';
        const results = await queryDatabase(query);
        const formatedResults = results.map(result => ({ ...result,
            fecha_registro: formatDate(result.fecha_registro),
        }));
        return res.json(formatedResults);
    } catch (error) {
        return res.status(500).json({ error: "Error en la solicitud al servidor. Intenta de nuevo mas tarde." });
    }
});

router.get('/paymentsSuppliers', async (req, res) => {
    try {
        const query = `SELECT nit, factura, fecfac, fecvcto, total, retencion, tot,
	        fecpago, pagfac, pagtot FROM pagopro WHERE fecpago IS NOT NULL`;
        const results = await queryDatabase(query);
        const formatedResults = results.map(result => ({ 
            ...result,
            total: formatPesos(result.total),
            retencion: formatPesos(result.retencion),
            tot: formatPesos(result.tot),
            pagfac: formatPesos(result.pagfac),
            pagtot: formatPesos(result.pagtot),
        }));
        return res.json(formatedResults);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error en la solicitud al servidor. Intenta de nuevo mas tarde." });
    }
});

router.get('/pendingEmails', async (req, res) => {
    try {
        const query = `SELECT pagopro.nit, factura, fecfac, fecvcto, total, retencion, tot,
	        fecpago, pagfac, pagtot,fecpago, correo 
          FROM proveedor INNER JOIN pagopro ON proveedor.nit = pagopro.nit 
          WHERE send_email = false AND proveedor.nit = pagopro.nit;`;
        const results = await queryDatabase(query);
        const formatedResults = results.map(result => ({ 
            ...result,
            total: formatPesos(result.total),
            retencion: formatPesos(result.retencion),
            tot: formatPesos(result.tot),
            pagfac: formatPesos(result.pagfac),
            pagtot: formatPesos(result.pagtot),
        }));
        return res.json(formatedResults);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error en la solicitud al servidor. Intenta de nuevo mas tarde." });
    }
});

module.exports = router;