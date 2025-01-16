const express = require("express");
const CORS = require("cors");
const fs = require("fs");
const multer = require("multer");

const app = express();
const port = 5000;

app.use(CORS());
app.use(express.json()); // Middleware для обработки JSON
app.use("/images", express.static(__dirname + "/img"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

/**
 * GET : /api/projects
 * returns JSON with all projects.
 * parameters : -
 * responses :
 *  200 - successful operation
 *  204 - no content
 */
app.get("/api/images", (req, res) => {
  fs.readdir("./img", (err, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Ошибка чтения директории");
    }
    const filePaths = files.map(
      (file) => `${req.protocol}://${req.get("host")}/images/${file}`,
    ); // получаем ссылки к картинам4

    projects;
    res.json(filePaths); // Отправляем массив путей к файлам в формате JSON
  });
});

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port ${port}`);
});
