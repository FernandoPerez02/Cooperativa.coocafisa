const express = require("express");
const cors = require("cors");
const session = require('express-session');
const schedule = require('node-schedule');
const dotenv = require('dotenv');

const app = express();

dotenv.config({ path: './env/.env' });
app.use(express.static('public'));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'] 
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'esto es secreto',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

const authentication = require("./services/user/authentication");
app.use("/auth", authentication);

const addusers = require("./services/user/addusers");
app.use("/adduser", addusers);

const queryinvoices = require("./services/user/invoices/queryIndex");
app.use("/queryindex", queryinvoices);

const resetpass = require("./services/email/emailpassword/resetpassword");
app.use("/recoverypass", resetpass)

const {obtainData} = require('./services/email/report/obtainData')
schedule.scheduleJob('8 11 * * *', () => {
    console.log("Ejecutando obtainData");
    obtainData();
});

app.use((err, req, res, next) => {
    console.error("Error inesperado:", err);
    res.status(500).json({ error: "Error inesperado en el servidor." });
});

app.listen(3001, () => {
    console.log(`Servidor en ejecución en http://localhost:3001`);
});
