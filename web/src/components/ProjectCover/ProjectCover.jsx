import styles from "./ProjectCover.module.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProjectCover = ({ id, imagesUrls, date, title }) => {
  const formattedDate = new Date(date).toLocaleDateString();
  const navigate = useNavigate();
  return (
    <article
      className={styles.ProjectCover}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <img src={imagesUrls[0]} alt={title} />
      <p>{formattedDate}</p>
      <h3>{title}</h3>
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
