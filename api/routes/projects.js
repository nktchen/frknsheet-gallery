const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/auth");
const controller = require("../controllers/projectController");

/**
 * @route GET /api/projects
 * @description Возвращает все проекты, разбитые по колонкам (0,1,2)
 * @returns {object} 200 OK
 * {
 *   0 : [
 *     {
 *       "id" : int
 *       "title": string
 *       "description" : string
 *       "date" : YY-MM-dd
 *       "imagesUrls" : string[]
 *     }
 *   ],
 *   1 : [...]
 *   2 : [...]
 * }
 * @access public
 */
router.get("/", controller.getAllProjects);

/**
 * @route POST /api/projects
 * @description Добавляет новый проект и связанные изображения
 * Проект автоматически распределяется в одну из трёх колонок на основе высоты изображений.
 * @body {string} title - Название проекта
 * @body {string} description - Описание проекта
 * @body {File[]} images - Список изображений проекта (multipart/form-data)
 * @returns {object} 201 Created
 * {
 *   message: "Проект и изображения успешно добавлены",
 *   projectId: number
 * }
 * @access protected
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  upload.any(),
  controller.addProject,
);

/**
 * @route GET /api/projects/:id
 * @description Возвращает проект по ID
 * @param {number} id - ID проекта
 * * @returns {object} 200 OK
 * {
 *    "id" : int
 *    "title": string
 *    "description" : string
 *    "date" : YY-MM-dd
 *    "imagesUrls" : string[]
 *  }
 *
 * @returns {object} 404 Not Found
 * {
 *   message: "Проект не найден"
 * }
 *
 * @access public
 */
router.get("/:id", controller.getProjectById);

/**
 * @route DELETE /api/projects/:id
 * @description Удаляет проект и связанные файлы по ID
 * @param {number} id - ID проекта
 * @access public
 */
router.delete("/:id", authMiddleware.verifyToken, controller.deleteProject);

module.exports = router;
