const mysql = require('mysql2');
const config = require('../config');

const dbConfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let connection;

function connectMysql() {
    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar con la base de datos', err);
            setTimeout(connectMysql, 2000);
        } else {
            return console.log('Conectado a la base de datos');
        }
    });
    connection.on('error', (err) => {
        console.error('Error de conexión a la base de datos', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectMysql();
        } else {
            throw err;
        }

    });
}
connectMysql();

function query(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE ${data}`, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}

module.exports = {
    query,
};