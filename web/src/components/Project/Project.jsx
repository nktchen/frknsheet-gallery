import styles from "./Project.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Skeleton from "../assets/Skeleton.jsx";
import Popup from "../assets/Popup/Popup.jsx";

const Project = () => {
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPopup, setIsPopup] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null); // null or {isSuccessfull: boolean, text: string}

  let params = useParams();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/projects/${params.id}`)
      .then((res) => {
        setProject(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setSuccessInfo({
          isSuccessfull: false,
          text: "Ошибка при получении проекта:" + err,
        });
        setIsPopup(true);
      });
  }, [params.id]);

  const toDate = (stringDate) => {
    const [day, month, year] = stringDate.split(".");
    return new Date(`${year}-${month}-${day}`);
  };
  return isLoading ? (
    <Skeleton></Skeleton>
  ) : (
    <section className={styles.projectWrapper}>
      <div className={styles.imgWrapper}>
        {project.imagesUrls.map((url, index) => (
          <img alt={project.description} key={index} src={url} />
        ))}
      </div>
      <div className={styles.infoWrapper}>
        <h3>{project.title}</h3>
        <h6>{toDate(project.date).toLocaleDateString()}</h6>
        <p>{project.description}</p>
      </div>

      {isPopup && (
        <Popup
          isSuccessfull={successInfo.isSuccessfull}
          text={successInfo.text}
        />
      )}
    </section>
  );
};

export default Project;
