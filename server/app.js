const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

dotenv.config({ path: "./env/.env" });
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.URL_CLIENT,
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
      maxAge: 1000 * 60 * 15,
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

const { router: shedulEmails, scheduleJob } = require("./services/user/admin/shedulEmails");
app.use("/shedulEmails", shedulEmails);
scheduleJob();

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Error inesperado en el servidor." });
});

app.get('/servidor', (req, res) => {
  res.send('Servidor en ejecución');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});