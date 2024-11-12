const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const schedule = require("node-schedule");
const fs = require("fs");

const app = express();

dotenv.config({ path: "./env/.env" });
app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    key: "session_cookie_name",
    secret: process.env.SESSION_SECRET || "esto es secreto",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.get('/session', (req, res) => {
  if (req.session && req.session.name) {
      return res.json({ isAuthenticated: true, user: req.session.name });
  } else {
      return res.json({ isAuthenticated: false });
  }
});


const authentication = require("./services/user/authentication");
app.use("/auth", authentication);

const addusers = require("./services/user/addusers");
app.use("/adduser", addusers);

const queryinvoices = require("./services/user/invoices/queryIndex");
app.use("/queryindex", queryinvoices);

const resetpass = require("./services/email/emailpassword/resetpassword");
app.use("/recoverypass", resetpass);

const queryUsers = require("./services/user/admin/registeredUsers");
app.use("/queryusers", queryUsers);

const querysAdmin = require("./services/user/admin/querysAdmin");
app.use("/programmatemails", querysAdmin);

/* router.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect('/');
  });
}); */

app.post("/schedulEmailings", (req, res) => {
  const { hour, minute } = req.body;
  if (!hour || !minute || isNaN(hour) || isNaN(minute)) {
    return res
      .status(400)
      .json({ error: "La hora o los minutos no son válidos." });
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return res
      .status(400)
      .json({
        error: "La hora o los minutos están fuera del rango permitido.",
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

    const { obtainData } = require("./services/email/report/obtainData");
    job = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
      console.log("Ejecutando obtainData");
      obtainData();
    });

    console.log("Job programado para la hora:", hour, minute);
  } catch (error) {
    console.error("Error al programar la hora de envío:", error);
    return "Error al programar la hora de envío";
  }
}

scheduleJob();

app.use((err, req, res, next) => {
  console.error("Error inesperado:", err);
  res.status(500).json({ error: "Error inesperado en el servidor." });
});

app.listen(3001, () => {
  console.log(`Servidor en ejecución en http://localhost:3001`);
});
