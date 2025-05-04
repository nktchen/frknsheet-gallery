import styles from "./ProjectCover.module.css";
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
const ProjectCover = ({ imagesUrls, date, title }) => {
  const formattedDate = new Date(date).toLocaleDateString();
  return (
    <article className={styles.ProjectCover}>
      <img src={imagesUrls[0]} alt={title} />
      <p>{formattedDate}</p>
      <h3>{title}</h3>
    </article>
  );
};

export default ProjectCover;
