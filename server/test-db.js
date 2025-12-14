require('dotenv').config();
const sql = require('mssql');

// Debug script to verify Azure Credentials locally
const config = {
    user: 'sqladmin@dental-sql-server', // Trying full username format
    password: 'Moazrashid@123',
    database: 'SoloDentalClinic',
    server: 'dental-sql-server.database.windows.net',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

console.log('--- TESTING LOCAL CONNECTION TO AZURE ---');
console.log('Server:', config.server);
console.log('Database:', config.database);
console.log('User:', config.user);
console.log('Password (Check this carefully):', config.password); // INTENTIONAL: Print password to verify local env
console.log('-------------------------------------------');

(async () => {
    try {
        console.log('Attempting to connect...');
        await sql.connect(config);
        console.log('✅ SUCCESS! These credentials work.');
    } catch (err) {
        console.error('❌ FAILURE:', err.message);
        if (err.originalError) {
             console.error('Original Error:', err.originalError.message);
        }
    } finally {
        // sql.close(); // Close connection
        process.exit();
    }
})();


