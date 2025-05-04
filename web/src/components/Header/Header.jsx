import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className={styles.header}>
      <Link to="/admin/upload">Upload</Link>
      <Link to="/projects">Projects</Link>
    </nav>
  );
};

export default Header;
