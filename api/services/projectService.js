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
        "SELECT height FROM images WHERE project_id = ?",
        [id],
      );
      columnsHeight[columnNum] = images.reduce(
        (sum, img) => sum + img.height,
        0,
      );
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

exports.addImage = async (projectId, filename, height) => {
  return pool.execute(
    "INSERT INTO images(project_id, image_filename, height) VALUES (?, ?, ?)",
    [projectId, filename, height],
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
