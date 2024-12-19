const router = require("express").Router();
const fs = require("fs");
const schedule = require("node-schedule");
const pool = require("../../../connectionBD/db");
const { resendEmails } = require("../../email/emailsPending");

router.post("/schedulEmailings", (req, res) => {
    const { hour, minute } = req.body;
    if (!hour || !minute || isNaN(hour) || isNaN(minute)) {
      return res
        .status(400)
        .json({ message: "La hora o los minutos no son válidos." });
    }
  
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return res
        .status(400)
        .json({
          message: "La hora o los minutos están fuera del rango permitido.",
        });
    }
  
    const data = { selectHour: `${hour}:${minute}`, hour, minute };
    fs.writeFileSync(
      "./services/email/report/hourprogram.json",
      JSON.stringify(data)
    );
  
    res.status(200).json({ message: "La hora se ha guardado correctamente." });
  });
  
  let job;
  
  function scheduleJob() {
    try {
      const data = fs.readFileSync(
        "./services/email/report/hourprogram.json",
        "utf8"
      );
      const { hour, minute } = JSON.parse(data);
  
      if (hour === undefined || minute === undefined) {
        return "No se encontró la hora o los minutos para la programación.";
      }
  
      if (job) {
        job.cancel();
      }
  
      const { obtainData } = require("../../email/report/obtainData");


      job = schedule.scheduleJob(`${minute} ${hour} * * *`, async() => {
        try {
          const query = `SELECT pagopro.nit, factura, fecfac, fecvcto, total, retencion, tot,
	        fecpago, pagfac, pagtot, str_to_Date(fecpago, '%e-%b-%y') AS fecpago, correo 
          FROM proveedor INNER JOIN pagopro ON proveedor.nit = pagopro.nit 
          WHERE str_to_Date(fecpago, '%e-%b-%y') = CURDATE()`;
          const results = await pool.query(query);
          if (results.length > 0) {
            await obtainData(results);
            await resendEmails();
          } else {
            return "No hay registros para el reporte.";
          }
        } catch (error) {
          return "Error al enviar el reporte.";
        }
      });
  
    } catch (error) {
      return "Error con el envio del correo.";
    }
  }

  router.post('/resendEmails', async (req, res) => {
    try {
      const results = await resendEmails();
      return res.status(200).json({ message: results });
    } catch (error) {
      return res.status(500).json({ message: "Error al enviar correos." });
    }
  });

module.exports = { router, scheduleJob };