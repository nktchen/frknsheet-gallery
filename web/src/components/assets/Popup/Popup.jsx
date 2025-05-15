import PropTypes from "prop-types";
import styles from "./Popup.module.css";

const Popup = (props) => {
  let msg = props.isSuccessfull ? "Yapi! " : "Error! ";
  msg += props.text;
  return (
    <div className={styles.Popup}>
      <img
        src={props.isSuccessfull ? "/public/success.png" : "/public/error.png"}
        alt={"icon"}
      />
      <p>{msg}</p>
    </div>
  );
};

Popup.propTypes = {
  isSuccessfull: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default Popup;
