import styles from "./ProjectCover.module.css";
import { useNavigate } from "react-router-dom";
/* props - array with projects
  [
    {
      "id" : int
      "title": string
      "description" : string
      "date" : YY-MM-dd
      "imagesUrls" : [string]
    }
  ]
*/
// eslint-disable-next-line react/prop-types
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

export default ProjectCover;
