const { imageSizeFromFile } = require("image-size/fromFile");
const fs = require("fs");
const path = require("path");

/**
 * Получение размеров изображения
 * @param {string} filePath
 * @returns {Promise<{width: number, height: number}>}
 */
exports.getDimensions = async (filePath) => {
  return await imageSizeFromFile(filePath);
};

/**
 * Удаление файла изображения
 * @param {string} filename
 */
exports.deleteFile = async (filename) => {
  const fullPath = path.join(__dirname, "..", "img", filename);
  return fs.promises.unlink(fullPath);
};
