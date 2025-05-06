import styles from "./Project.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Project = () => {
  const [project, setProject] = useState({}); //TODO add sceleton
  let params = useParams();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/projects/${params.id}`)
      .then((res) => res.data)
      .then((data) => {
        setProject(data);
      })
      .catch((err) => console.error("Ошибка при получении проекта:", err)); //TODO add Error page
  });
  const formattedDate = new Date(project.date).toLocaleDateString();
  return (
    <article className={styles["project-container"]}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p>{formattedDate}</p>
      {project.imagesUrls.map((url, index) => (
        <img alt={project.description} key={index} src={url} />
      ))}
    </article>
  );
};

export default Project;
