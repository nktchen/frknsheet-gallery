const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST,
  user: "root",
  database: "gallery",
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
