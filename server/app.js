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
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      /* secure: true, */
      maxAge: 1000 * 60 * 2,
      sameSite: "lax",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

    },
  })
);

app.use((req, res, next) => {
  if (req.session && req.session.name) {
    req.session.lastActivity = Date.now();
  }
  next();
});

const getSession = require("./services/functions/sessions");
app.use('/managerSession', getSession);

app.get('/session', (req, res) => {
  if (req.session && req.session.name) {
      return res.json({ isAuthenticated: true, user: req.session.name, role: req.session.role });
  } else {
      return res.json({ isAuthenticated: false, user: null });
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

const emailsProgrammer = require("./services/user/admin/emailsProgrammer");
app.use("/emailsprogrammer", emailsProgrammer);

app.get('/logout', (req, res) => {
  const userName = req.session ? req.session.name : 'Desconocido';
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    console.log("Cerrando sesión de usuario:", userName);
    res.clearCookie('session_cookie_name');
    return res.status(200).json({ message: 'Sesión cerrada exitosamente', redirect: "/"});
  });
})

app.post("/schedulEmailings", (req, res) => {
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
