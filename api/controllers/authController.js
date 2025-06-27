require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.authorise = async (req, res) => {
  const password = req.body.password;
  const hash = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!password) {
    return res.status(400).json({ message: "Пароль обязателен" });
  }

  try {
    const match = await bcrypt.compare(password, hash);
    if (!match) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "7d" });

    return res.status(200).json({ message: "Авторизация успешна", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};
