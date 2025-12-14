require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true' || true, // Default to true for Azure
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true' || true // Default to true for dev/self-signed
    }
};

module.exports = config;
