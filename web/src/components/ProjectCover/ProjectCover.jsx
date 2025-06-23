import styles from "./ProjectCover.module.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProjectCover = ({ id, imagesUrls, date, title }) => {
  const [day, month, year] = date.split(".");
  const formattedDate = new Date(
    `${year}-${month}-${day}`,
  ).toLocaleDateString();
  const navigate = useNavigate();
  return (
    <article
      className={styles.ProjectCover}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <img src={imagesUrls[0]} alt={title} />
      <div className={styles.ProjectInfoWrapper}>
        <h3>{title}</h3>
        <p>{formattedDate}</p>
      </div>
    </article>
  );
};

ProjectCover.propTypes = {
  id: PropTypes.number.isRequired,
  imagesUrls: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired, //YY-mm-dd
  title: PropTypes.string.isRequired,
};

export default ProjectCover;
