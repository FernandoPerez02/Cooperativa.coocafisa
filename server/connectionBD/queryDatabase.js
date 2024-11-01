const pool = require("./db")

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

module.exports = queryDatabase