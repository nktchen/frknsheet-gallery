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
 *  500 - internal server error
 **/
app.get("/api/projects", async (req, res) => {
  try {
    let [projects] = await pool.execute("SELECT * FROM projects");

    await Promise.all(
      projects.map(async (project) => {
        const [images] = await pool.execute(
          "SELECT * FROM images WHERE project_id = ?",
          [project.id],
        );

        project.images = images.map(
          (img) =>
            `${req.protocol}://${req.get("host")}/images/${img.image_filename}`,
        );
      }),
    );

    res.status(200).send(projects);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
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
app.post("/api/projects", upload.any(), async (req, res) => {
  let imgFiles = req.files; //uploading files by multer
  if (!imgFiles) res.status(400).send("Ошибка при загрузке файлов");

  let date = new Date();
  try {
    let [result] = await pool.execute(
      "INSERT INTO projects(title, description, date) VALUES (?, ?, ?)",
      [
        req.body.title,
        req.body.description,
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getDate()}`,
      ],
    );

    const jobID = result.insertId;
    await Promise.all(
      imgFiles.map(async (imgFile) => {
        pool.execute(
          "INSERT INTO images(project_id, image_filename) VALUES (?, ?)",
          [jobID, imgFile.filename],
        );
      }),
    );
    res.status(201).send(`Проект и изображение успешно добавлены`);
  } catch (error) {
    //TODO - добавить удаление при ошибке
    console.error(error);
    res
      .status(500)
      .send(`Ошибка при добавлении проекта в базу данных: ${error}`);
  }
});

app.listen(port, function () {
  console.log(
    `CORS-enabled web server listening on port ${port}. http://localhost:${port}`,
  );
});
