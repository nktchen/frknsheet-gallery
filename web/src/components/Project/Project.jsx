import styles from "./Project.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Skeleton from "../assets/Skeleton.jsx";

const Project = () => {
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  let params = useParams();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/projects/${params.id}`)
      .then((res) => {
        setProject(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.error("Ошибка при получении проекта:", err)); //TODO add Error page
  }, [params.id]);
  return isLoading ? (
    <Skeleton></Skeleton>
  ) : (
    <article className={styles["project-container"]}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p>{new Date(project.date).toLocaleDateString()}</p>
      {project.imagesUrls.map((url, index) => (
        <img alt={project.description} key={index} src={url} />
      ))}
    </article>
  );
};

export default Project;
