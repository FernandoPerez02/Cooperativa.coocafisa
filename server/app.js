const redis = require('ioredis');
const { RedisStore } = require('connect-redis');
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config({ path: './env/.env' });
app.use(express.static('public'));

app.use(
  cors({
    origin: process.env.URL_CLIENT,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const redisClient = new redis(process.env.REDIS_URL);

redisClient.ping()
  .then((result) => {
    console.log('Conexión a Redis exitosa:', result); 
  })
  .catch((err) => {
    console.error('Error al conectar con Redis:', err);
  });

var sessionMiddleware = session({
  store: new RedisStore({ client: redisClient, ttl: 1000 * 60 * 10 }),
  key: 'session_cookie',
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 10,
    sameSite: 'strict',
  },
});

app.set('trust proxy', 1);
app.use(sessionMiddleware);

app.use((req, res, next) => {
  console.log('Datos de sesión:', req.session.name, req.session.role, req.session.lastActivity);
  next();
});

app.use((req, res, next) => {
  if (req.session && req.session.name) {
    req.session.lastActivity = Date.now();
  }
  next();
});

const getSession = require('./services/functions/sessions');
app.use('/managerSession', getSession);

const authentication = require('./services/user/authentication');
app.use('/auth', authentication);

const addusers = require('./services/user/addusers');
app.use('/adduser', addusers);

const queryinvoices = require('./services/user/invoices/queryIndex');
app.use('/queryindex', queryinvoices);

const resetpass = require('./services/email/emailpassword/resetpassword');
app.use('/recoverypass', resetpass);

const queryUsers = require('./services/user/admin/registeredUsers');
app.use('/queryusers', queryUsers);

const querysAdmin = require('./services/user/admin/querysAdmin');
app.use('/programmatemails', querysAdmin);

const emailsProgrammer = require('./services/user/admin/emailsProgrammer');
app.use('/emailsprogrammer', emailsProgrammer);

const { router: shedulEmails, scheduleJob } = require('./services/user/admin/shedulEmails');
app.use('/shedulEmails', shedulEmails);
scheduleJob();

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error inesperado en el servidor.' });
});

app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.send(`Número de visitas: ${req.session.views}`);
});

app.get('/api/session', (req, res) => {
  if (!req.session.visits) {
    req.session.visits = 1;
  } else {
    req.session.visits += 1;
  }

  res.json({ message: 'Sesión activa', visits: req.session.visits });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Servidor en ejecución.');
});
