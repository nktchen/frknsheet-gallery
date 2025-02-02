const express = require("express");
const CORS = require("cors");
// const fs = require("fs");
const mysql = require("mysql2");
// const multer = require("multer");

const app = express();
const port = 5000;

app.use(CORS());
app.use(express.json()); // Middleware для обработки JSON
app.use("/images", express.static(__dirname + "/img"));
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "gallery",
  password: process.env.DB_PASSWORD,
});

//
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "img");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

/**
 * GET : /api/projects
 * returns JSON with all projects: {
 *   [
 *     {
 *       "id" : int
 *       "title": string
 *       "description" : string
 *       "date" : YY-MM-dd
 *       "imagesUrl" : [string]
 *     }
 *   ]
 * }.
 * parameters : -
 * responses :
 *  200 - successful operation
 *  204 - no content
 */
app.get("/api/projects", (req, res) => {
  pool.query("SELECT * FROM projects", (err, result) => {
    if (err) return console.log(err);
    res.json(result);
  });
  // fs.readdir("./img", (err, files) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).send("Ошибка чтения директории");
  //   }
  //   const filePaths = files.map(
  //     (file) => `${req.protocol}://${req.get("host")}/images/${file}`,
  //   ); // получаем ссылки к картинам4
  //   res.json(); // Отправляем массив путей к файлам в формате JSON
  // });
});
/**
 * POST : /api/projects
 * gets HTML form with enctype="multipart/form-data"
 * names - title, description, date, images
 * returns HTTP codes
 * parameters -
 * responses
 *  201 - successful operation
 *  400 - bad request!
 */
app.post("/api/projects", (req, res) => {
  pool.query("INSERT INTO projects(title, description, date) SET ?", []);
});

app.listen(port, function () {
  console.log(
    `CORS-enabled web server listening on port ${port}. http://localhost:${port}`,
  );
});
