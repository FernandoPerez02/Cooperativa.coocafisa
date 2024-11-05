const { formatDate } = require("../../functions/helpers");
const { emailSend, sendNotificationEmail } = require("../emailService");
const { generarReportePDF, generarResumenPDF } = require("./generatepdf");
const pool = require("../../../connectionBD/db");

const obtainData = async () => {
  const query = `SELECT pagos.nit, razonsoc, descuento, retencion, total, fecpago, correo
    FROM usuarios INNER JOIN pagos ON usuarios.nit = pagos.nit WHERE fecpago = CURDATE()`;

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

      // Generación del PDF resumen
      const summaryPdfBuffer = await generarResumenPDF(emailsSent);
      await sendNotificationEmail(emailsSent.length, summaryPdfBuffer);
      console.log("Todos los correos fueron enviados exitosamente.");
    } else {
      console.log("No hay registros para la fecha actual.");
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    console.error("Error al obtener los datos:", error.message || error);
  }
};

module.exports = { obtainData };
