import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCover from "../../ProjectCover/ProjectCover.jsx";
import styles from "./ProjectsScreen.module.css";

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]); //TODO add sceleton

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/projects")
      .then((res) => res.data)
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.error("Ошибка при получении проектов:", err)); //TODO add Error page
  }, []);

  return (
    <section className={styles.ProjectScreen}>
      {projects.map((project) => (
        <ProjectCover key={project.id} {...project} />
      ))}
    </section>
  );
};

export default ProjectsScreen;
