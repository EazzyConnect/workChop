const mysql = require("mysql2/promise");

const mysqlPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "MancitiMySQL1@",
  database: "workchop_db",
});

module.exports = mysqlPool;
