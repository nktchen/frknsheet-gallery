const projectService = require("../services/projectService");
const imageService = require("../services/imageService");

exports.addProject = async (req, res) => {
  const files = req.files;
  if (!files?.length) {
    return res.status(400).send({ message: "Ошибка при загрузке файлов" });
  }

  try {
    const date = new Date();
    const formatted = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")} - ${String(date.getDate()).padStart(2, "0")}`;
    const columnNum = await projectService.chooseColumn();

    const projectId = await projectService.addProject(
      req.body.title,
      req.body.description,
      formatted,
      columnNum,
    );

    await Promise.all(
      files.map(async (file) => {
        const dims = await imageService.getDimensions(file.path);
        await projectService.addImage(projectId, file.filename, dims.height);
      }),
    );

    res.status(201).send({ message: "Проект и изображения успешно добавлены" });
  } catch (error) {
    // При ошибке удаляем загруженные файлы
    await Promise.all(
      req.files.map((f) => imageService.deleteFile(f.filename).catch(() => {})),
    );
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    if (!projects?.length) {
      return res.status(404).send({ message: "Нет проектов" });
    }

    const result = { 1: [], 2: [], 3: [] };
    for (const proj of projects) {
      const images = await projectService.getImagesByProject(proj.id);
      proj.imagesUrls = images.map(
        (name) =>
          `${req.protocol}://${req.hostname}:${process.env.PORT}/images/${name}`,
      );
      result[proj.columnNum + 1].push(proj);
    }

    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Внутренняя ошибка сервера" });
  }
};

exports.getProjectById = async (req, res) => {
  const id = req.params.id;
  try {
    const projects = await projectService.getAllProjects();
    const project = projects.find((p) => p.id == id);
    if (!project) {
      return res.status(404).send({ message: "Проект не найден" });
    }

    const images = await projectService.getImagesByProject(id);
    project.imagesUrls = images.map(
      (name) =>
        `${req.protocol}://${req.hostname}:${process.env.PORT}/images/${name}`,
    );

    res.send(project);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Внутренняя ошибка сервера" });
  }
};

exports.deleteProject = async (req, res) => {
  const id = req.params.id;
  try {
    const images = await projectService.getImagesByProject(id);

    await Promise.all(
      images.map((f) => imageService.deleteFile(f).catch(() => {})),
    );

    await projectService.deleteProject(id);

    res.send({ message: "Проект удален" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка при удалении проекта" });
  }
};
