import styles from "./Project.module.css";
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
const Project = ({ imagesUrls, description, date, title }) => {
  const formattedDate = new Date(date).toLocaleDateString();
  return (
    <article className={styles["project-container"]}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>{formattedDate}</p>
      {/* eslint-disable-next-line react/prop-types */}
      {imagesUrls.map((url, index) => (
        <img alt={description} key={index} src={url} />
      ))}
    </article>
  );
};

export default Project;
