const express = require("express");
const CORS = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const { randomUUID } = require("crypto");

const app = express();
const port = 5000;

app.use(CORS());
app.use(express.json()); // обработка JSON
app.use("/images", express.static(__dirname + "/img")); // обработка статических файлов
const pool = mysql.createPool({
  // база данных
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "gallery",
  password: process.env.DB_PASSWORD,
});

const storage = multer.diskStorage({
  // обработка загрузки файлов
  destination: function (req, file, cb) {
    cb(null, "img");
  },
  filename: function (req, file, cb) {
    let filenameExtension = file.originalname.split(".").at(-1);
    cb(null, `${randomUUID()}.${filenameExtension}`);
  },
});
const upload = multer({ storage: storage });

/** returns JSON with all projects
 * GET : /api/projects
 * response json: {
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
 **/
app.get("/api/projects", (req, res) => {
  pool
    .execute("SELECT * FROM projects")
    .then(([result]) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
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

/** adds project and images
 * POST : /api/projects
 * gets HTML form with enctype="multipart/form-data"
 * names - title, description
 * returns HTTP codes
 * parameters -
 * responses
 *  201 - successful operation
 *  400 - bad request!
 *  500 - error while uploading
 **/
app.post("/api/projects", upload.any(), (req, res) => {
  let imgFiles = req.files; //uploading files by multer
  if (!imgFiles) res.status(400).send("Ошибка при загрузке файлов");

  let date = new Date();
  // adding projects to database
  pool
    .execute(
      "INSERT INTO projects(title, description, date) VALUES (?, ?, ?)",
      [
        req.body.title,
        req.body.description,
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getDate()}`,
      ],
    )
    .then(([result]) => {
      const jobID = result.insertId;
      // adding images to database
      for (let file of imgFiles) {
        pool.execute(
          "INSERT INTO images(project_id, image_filename) VALUES (?, ?)",
          [jobID, file.filename],
        );
      }
    })
    .then(() => {
      res.status(201).send(`Проект и изображение успешно добавлены`);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send(`Ошибка при добавлении проекта в базу данных: ${error}`);
    });
});

app.listen(port, function () {
  console.log(
    `CORS-enabled web server listening on port ${port}. http://localhost:${port}`,
  );
});
