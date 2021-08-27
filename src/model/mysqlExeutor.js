const mysql      = require('mysql2/promise');
const mysqlOptions = require('./mysqlOptions');                 //db connection module

module.exports = async (statement, fields) => {
    try{
        const connection = await mysql.createConnection(mysqlOptions);
        const [rows] = await connection.query(statement, fields)
        await connection.end()

        return rows;
    } catch (e) {
        console.error(e);
        return new Error(-1)
    }
}