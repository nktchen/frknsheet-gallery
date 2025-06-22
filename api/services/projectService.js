const pool = require("../db/pool");

/**
 * Выбирает колонку с минимальной суммарной высотой
 * @returns {Promise<number>} columnNum (0, 1 или 2)
 */
exports.chooseColumn = async () => {
  const columnsHeight = [0, 0, 0];
  const [projects] = await pool.execute("SELECT id, columnNum FROM projects");

  // Собираем высоты обложек по колонкам и суммируем
  await Promise.all(
    projects.map(async ({ id, columnNum }) => {
      const [images] = await pool.execute(
        "SELECT height, width FROM images WHERE project_id = ?",
        [id],
      );
      columnsHeight[columnNum] +=
        (400 / images[0].width) * images[0].height + 40;
      // привожу высоту к растянутому до 400 пикселей в ширину изображению и добавляю gap между изображениями
    }),
  );
  return columnsHeight.indexOf(Math.min(...columnsHeight));
};

exports.addProject = async (title, description, date, columnNum) => {
  const [result] = await pool.execute(
    "INSERT INTO projects(title, description, date, columnNum) VALUES (?, ?, ?, ?)",
    [title, description, date, columnNum],
  );
  return result.insertId;
};

exports.addImage = async (projectId, filename, height, width) => {
  return pool.execute(
    "INSERT INTO images(project_id, image_filename, height, width) VALUES (?, ?, ?, ?)",
    [projectId, filename, height, width],
  );
};

exports.getAllProjects = async () => {
  const [projects] = await pool.execute("SELECT * FROM projects");
  return projects;
};

exports.getImagesByProject = async (projectId) => {
  const [images] = await pool.execute(
    "SELECT image_filename FROM images WHERE project_id = ?",
    [projectId],
  );
  return images.map((img) => img.image_filename);
};

exports.deleteProject = async (projectId) => {
  return pool.execute("DELETE FROM projects WHERE id = ?", [projectId]);
};
