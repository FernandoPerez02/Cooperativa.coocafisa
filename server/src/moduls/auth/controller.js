const bcrypt = require('bcrypt');
const auth = require('../../authentication');

const table = 'user';

module.exports = function(dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }

    /* Se puede ingresar los datos que  necesita para esa tabla.
    Ejemplo
    const authData = {
            id_user: data.id_user,
        }  */

    async function consultUser(data) {
    return db.query(table, data)
    }

    return {
        consultUser,
    }

}