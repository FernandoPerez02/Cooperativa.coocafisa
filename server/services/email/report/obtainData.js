const { formatDate } = require("../../functions/helpers");
const { emailSend, sendNotificationEmail } = require("../emailService");
const { generarReportePDF, generarResumenPDF } = require("./generatepdf");
const pool = require("../../../connectionBD/db");
const { json } = require("express");

const obtainData = async () => {
  const query = `SELECT pagopro.nit, razonsoc, retencion, total, str_to_Date(fecpago, '%e-%b-%y') AS fecpago, correo
    FROM proveedor INNER JOIN pagopro ON proveedor.nit = pagopro.nit WHERE str_to_Date(fecpago, '%e-%b-%y') = CURDATE()`;

  try {
    const [results] = await pool.query(query);
    if (results.length > 0) {
      const formattedResults = results.map((result) => ({
        ...result,
        fecpago: formatDate(result.fecpago),
      }));

      const groupedResults = formattedResults.reduce((acc, current) => {
        if (!acc[current.nit]) acc[current.nit] = [];
        acc[current.nit].push(current);
        return acc;
      }, {});

      const emailsSent = [];

      await Promise.all(
        Object.keys(groupedResults).map(async (nit) => {
          const data = groupedResults[nit];
          emailsSent.push(...data);
          const pdfPath = await generarReportePDF(data);
          await emailSend(data, pdfPath);
        })
      );

      const summaryPdfBuffer = await generarResumenPDF(emailsSent);
      await sendNotificationEmail(emailsSent.length, summaryPdfBuffer);
    } else {
      return json({ message: "No hay datos para el reporte." });
    }
  } catch (error) {
    return json({ message: "Error al obtener los datos." });
  }
};

module.exports = { obtainData };
