const pool = require('../../connectionBD/db');

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

function paginator(totalItems, currentPage = 1, itemsPerPage = 6) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
        totalItems,
        currentPage,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
    };
};

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

const isAuthenticated = (req, res, next) => {
    if (req.session.name) {
        return next();
    }
    res.redirect('/');
};

module.exports = {
    formatDate, paginator, queryDatabase,isAuthenticated
};