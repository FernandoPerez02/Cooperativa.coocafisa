/* const pool = require("./db")

const queryDatabase = async (query, params) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(query, params);
        return results;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error.message, { query, params });
        throw new Error(`Error en la consulta a la base de datos: ${error.message}`);
    } finally {
        connection.release();
    }
};

module.exports = queryDatabase */

const pool = require("./db");

const queryDatabase = async (query, params) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.query(query, params || []);
        
        if (!results || results.length === 0) {
            console.warn('No se encontraron resultados para la consulta:', { query, params });
        }
        
        return results;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error.message, { query, params });
        throw new Error(`Error en la consulta a la base de datos: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = queryDatabase;
