const pool = require("../../connectionBD/db");
const {obtainData} = require("./report/obtainData")

async function resendEmails () {
    const query = `SELECT pagopro.nit, factura, fecfac, fecvcto, total, retencion, tot,
	        fecpago, pagfac, pagtot, str_to_Date(fecpago, '%e-%b-%y') AS fecpago, correo 
          FROM proveedor INNER JOIN pagopro ON proveedor.nit = pagopro.nit 
          WHERE send_email = false AND proveedor.nit = pagopro.nit;`;
    const results = await pool.query(query);
    if (results.length > 0) {
        await obtainData(results);
        return "Correos enviados con éxito.";
    } else {
        return "No hay correos pendientes.";
    }
}


module.exports = {resendEmails};