const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '2sLir2&1tSHK',
        database: 'election'
    },
    console.log('Connected to the database.')
);

module.exports = db;