import axios from "axios";
import { useEffect, useState } from "react";
import Project from "../Project/Project.jsx";

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]); //TODO add sceleton
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/projects")
      .then((res) => res.data)
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.error("Ошибка при получении проектов:", err));
  }, []);

  return (
    <>
      {projects.map((project) => (
        <Project key={project.id} {...project} />
      ))}
    </>
  );
};

export default ProjectsScreen;
