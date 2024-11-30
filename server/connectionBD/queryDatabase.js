const { json } = require("express");
const pool = require("./db");

const queryDatabase = async (query, params) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.query(query, params || []);
        
        if (!results || results.length === 0) {
            return json({ message: "No hay registros para la consulta." });
        }
        
        return results;
    } catch (error) {
        throw new Error(`Error en la consulta a la base de datos: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = queryDatabase;
