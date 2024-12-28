var table = 'usuario';

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql.js');
    }

    async function consultUser() {
        const selecTable = table + ' INNER JOIN usuario ON proveedor.proveedor_id = usuario.proveedor_id';
        const fields = 'rol, proveedor.nit, razonsoc, correo';
        const params = 'nit = 1033646987';
        return await db.query(selecTable, fields, params);
    }

    return {
        consultUser,
    }
};