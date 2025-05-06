const express = require("express");
const CORS = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;

app.use(CORS());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "img")));

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "gallery",
  password: process.env.DB_PASSWORD,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "img");
  },
  filename: function (req, file, cb) {
    const filenameExtension = file.originalname.split(".").pop();
    cb(null, `${randomUUID()}.${filenameExtension}`);
  },
});

const upload = multer({ storage: storage });

/**
 * Adds project and images
 * POST : /api/projects
 **/
app.post("/api/projects", upload.any(), async (req, res) => {
  const imgFiles = req.files;

  if (!imgFiles || imgFiles.length === 0) {
    return res.status(400).send({ message: "Ошибка при загрузке файлов" });
  }

  const date = new Date();

  try {
    const [result] = await pool.execute(
      "INSERT INTO projects(title, description, date) VALUES (?, ?, ?)",
      [
        req.body.title,
        req.body.description,
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      ],
    );

    const jobID = result.insertId;

    await Promise.all(
      imgFiles.map(async (imgFile) => {
        await pool.execute(
          "INSERT INTO images(project_id, image_filename) VALUES (?, ?)",
          [jobID, imgFile.filename],
        );
      }),
    );

    res.status(201).send({ message: "Проект и изображения успешно добавлены" });
  } catch (error) {
    // Удаление загруженных изображений в случае ошибки
    imgFiles.forEach((file) => {
      fs.unlink(path.join(__dirname, "img", file.filename), (err) => {
        if (err)
          console.error(`Ошибка при удалении файла ${file.filename}: ${err}`);
      });
    });

    console.error(error);
    res.status(500).send({
      message: `Ошибка при добавлении проекта в базу данных: ${error.message}`,
    });
  }
});

/**
 * Returns JSON with all projects
 * GET : /api/projects
 * returns JSON:
 *   [
 *     {
 *       "id" : int
 *       "title": string
 *       "description" : string
 *       "date" : YY-MM-dd
 *       "imagesUrls" : string[]
 *     }
 *   ]
 **/
app.get("/api/projects", async (req, res) => {
  try {
    const [projects] = await pool.execute("SELECT * FROM projects");

    if (projects.length === 0) {
      return res.status(404).send({ message: "Нет проектов" });
    }

    await Promise.all(
      projects.map(async (project) => {
        const [images] = await pool.execute(
          "SELECT * FROM images WHERE project_id = ?",
          [project.id],
        );

        project.imagesUrls = images.map(
          (img) =>
            `${req.protocol}://${req.hostname}:${port}/images/${img.image_filename}`,
        );
      }),
    );

    res.status(200).send(projects);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Внутренняя ошибка сервера" });
  }
});

/**
 * Returns JSON with project by ID
 * GET : /api/projects/:id
 * returns JSON:
 *  {
 *    "id" : int
 *    "title": string
 *    "description" : string
 *    "date" : YY-MM-dd
 *    "imagesUrls" : string[]
 *  }
 **/
app.get("/api/projects/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [project] = await pool.execute(
      "SELECT * FROM projects WHERE id = ?",
      [id],
    );

    if (project.length === 0) {
      return res.status(404).send({ message: "Проект не найден" });
    }

    const [images] = await pool.execute(
      "SELECT * FROM images WHERE project_id = ?",
      [id],
    );

    project[0].imagesUrls = images.map(
      (img) =>
        `${req.protocol}://${req.hostname}:${port}/images/${img.image_filename}`,
    );

    res.status(200).send(project[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Внутренняя ошибка сервера" });
  }
});

/**
 * Deletes project by ID
 * DELETE : /api/projects/:id
 **/
app.delete("/api/projects/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Удаление изображений из базы данных
    const [images] = await pool.execute(
      "SELECT image_filename FROM images WHERE project_id = ?",
      [id],
    );

    // Удаление изображений из файловой системы
    await Promise.all(
      images.map((img) =>
        fs.promises
          .unlink(path.join(__dirname, "img", img.image_filename))
          .catch((err) =>
            console.error(
              `Ошибка при удалении файла ${img.image_filename}: ${err}`,
            ),
          ),
      ),
    );

    // Удаление проекта из базы данных
    await pool.execute("DELETE FROM projects WHERE id = ?", [id]);

    res.status(200).send({ message: "Проект успешно удален" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Ошибка при удалении проекта" });
  }
});

app.listen(port, function () {
  console.log(
    `CORS-enabled web server listening on port ${port}. http://localhost:${port}`,
  );
});
