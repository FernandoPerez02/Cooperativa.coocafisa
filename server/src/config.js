require('dotenv').config();
module.exports = {
    app: {
        port: process.env.PORT,
        origin: process.env.URL_CLIENT
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },

    mysql: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    }
};