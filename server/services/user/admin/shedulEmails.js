const router = require("express").Router();
const fs = require("fs");
const schedule = require("node-schedule");

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
      job = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
        obtainData();
      });
  
    } catch (error) {
      return "Error con el envio del correo.";
    }
  }

module.exports = { router, scheduleJob };