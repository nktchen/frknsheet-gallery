import axios from "axios";
import { useEffect, useState } from "react";

const Projects = () => {
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/projects")
      .then((res) => res.data)
      .then((data) => {
        setProjects(data);
      });
  });

  return <>{projects.map((project) => ())}</>;
};

export default Projects;
