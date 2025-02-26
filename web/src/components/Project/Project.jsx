/* props - array with projects
  [
    {
      "id" : int
      "title": string
      "description" : string
      "date" : YY-MM-dd
      "imagesUrl" : [string]
    }
  ]
*/
// eslint-disable-next-line react/prop-types
const Project = ({ imagesUrls, description, date, title }) => {
  console.log(date);
  const formattedDate = new Date(date).toLocaleDateString();
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>{formattedDate}</p>
      {/* eslint-disable-next-line react/prop-types */}
      {imagesUrls.map((url, index) => (
        <img alt={description} key={index} src={url} />
      ))}
    </div>
  );
};

export default Project;
