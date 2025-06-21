const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/projectController");

/**
 * @route POST /api/projects
 * @description Добавляет новый проект и связанные изображения
 * @access public
 */
router.post("/", upload.any(), controller.addProject);
/**
 * @route GET /api/projects
 * @description Возвращает все проекты, разбитые по колонкам (1, 2, 3)
 * return : {
 *   1 : [
 *     {
 *       "id" : int
 *       "title": string
 *       "description" : string
 *       "date" : YY-MM-dd
 *       "imagesUrls" : string[]
 *     }
 *   ] (array with objs)
 *   2 : same array structure
 *   3 : same array structure
 * }
 * @access public
 */
/**
 * Returns JSON with all projects
 * GET : /api/projects
 * returns JSON:

 **/
router.get("/", controller.getAllProjects);
/**
 * @route GET /api/projects/:id
 * @description Возвращает проект по ID
 * return {
 *    "id" : int
 *    "title": string
 *    "description" : string
 *    "date" : YY-MM-dd
 *    "imagesUrls" : string[]
 *  }
 * @access public
 */
router.get("/:id", controller.getProjectById);
/**
 * @route DELETE /api/projects/:id
 * @description Удаляет проект и связанные файлы по ID
 * @access public
 */
router.delete("/:id", controller.deleteProject);

module.exports = router;
