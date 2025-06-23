require("dotenv").config();
const express = require("express");
const CORS = require("cors");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();
const port = process.env.PORT || 5000;

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: "gallery",
    user: "root",
    password: process.env.DB_PASSWORD,
  });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      date VARCHAR(32) NOT NULL,
      columnNum TINYINT NOT NULL
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      image_filename VARCHAR(255) NOT NULL,
      height INT NOT NULL,
      width INT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  await connection.end();
})();

app.use(CORS());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "img")));
app.use("/api/projects", require("./routes/projects"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
