import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCover from "../../ProjectCover/ProjectCover.jsx";
import Skeleton from "../../assets/Skeleton.jsx";
import styles from "./ProjectsScreen.module.css";

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/projects")
      .then((res) => res.data)
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch((err) => console.error("Ошибка при получении проектов:", err)); //TODO add Error page
  }, []);

  return (
    <div className={styles.Wrapper}>
      {[...new Array(3)].map((_, i) => (
        <section className={styles.ProjectScreen} key={i}>
          {isLoading
            ? [...new Array(3)].map((_, j) => <Skeleton key={j}></Skeleton>)
            : projects[i + 1].map((project) => (
                <ProjectCover key={project.id} {...project} />
              ))}
        </section>
      ))}
    </div>
  );
};

export default ProjectsScreen;
