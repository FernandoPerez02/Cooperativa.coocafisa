const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const error = require('./red/error');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', config.app.port);

app.use('/users', users);
app.use(error);

module.exports = app;