require("dotenv").config();
const express = require("express");
const CORS = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

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
