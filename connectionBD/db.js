const dotenv  = require("dotenv")
dotenv.config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
});


// Escuchar cuando se obtiene una conexión
pool.on('acquire', (connection) => {
    console.log(`Conexión ${connection.threadId} adquirida.`);
});

// Escuchar cuando se libera una conexión
pool.on('release', (connection) => {
    console.log(`Conexión ${connection.threadId} liberada.`);
});

// Escuchar cuando ocurre un nuevo intento de conexión
pool.on('enqueue', () => {
    console.log('Esperando conexión disponible...');
});

module.exports = pool;