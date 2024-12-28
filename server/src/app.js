const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const error = require('./red/error');
const users = require('./moduls/users/routes');
const suppliers = require('./moduls/suppliers/routes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    origin: app.get('origin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.set('port', config.app.port);
app.set('origin', config.app.origin);

app.set('trust proxy', 1);

app.use('/users', users);
app.use('/supplier', suppliers);
app.use(error);

module.exports = app;