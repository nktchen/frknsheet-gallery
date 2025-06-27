const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/authController");

/**
 * @route POST /api/auth
 * @description Авторизация админа
 * @access public
 * @body {string} password - Пароль администратора
 * @returns 200 - Успешная авторизация
 * @returns 401 - Неверные учетные данные
 */
router.post("/", upload.any(), controller.authorise);
