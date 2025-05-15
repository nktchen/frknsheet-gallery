import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCover from "../../ProjectCover/ProjectCover.jsx";
import Skeleton from "../../assets/Skeleton.jsx";
import styles from "./ProjectsScreen.module.css";
import Popup from "../../assets/Popup/Popup.jsx";

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopup, setIsPopup] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null); // null or {isSuccessfull: boolean, text: string}

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/projects")
      .then((res) => res.data)
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setSuccessInfo({
          isSuccessfull: false,
          text: "Ошибка при получении проектов:" + err,
        });
        setIsPopup(true);
      });
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

      {isPopup && (
        <Popup
          isSuccessfull={successInfo.isSuccessfull}
          text={successInfo.text}
        />
      )}
    </div>
  );
};

export default ProjectsScreen;
