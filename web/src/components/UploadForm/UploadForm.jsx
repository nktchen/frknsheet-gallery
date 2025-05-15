import Popup from "../assets/Popup/Popup.jsx";
import { useState } from "react";

const UploadForm = () => {
  const [isPopup, setIsPopup] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null); // null or {isSuccessfull: boolean, text: string}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const fetchURL = "http://127.0.0.1:5000/api/projects";

    fetch(fetchURL, {
      method: "POST",
      body: form,
    })
      .then(async (res) => {
        setSuccessInfo({ isSuccessfull: res.ok, text: await res.text() });
        setIsPopup(true);
      })
      .catch((err) => {
        setIsPopup(true);
        setSuccessInfo({ isSuccessfull: false, text: err });
      });
  };

  return (
    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
      <label htmlFor="title">Заголовок</label>
      <input id="title" name="title" type="text" required autoFocus />

      <label htmlFor="description">Описание</label>
      <input id="description" name="description" type="text" />

      <label htmlFor="image"></label>
      <input id="image" name="image" type="file" multiple required />

      <button type="submit">Добавить!</button>

      {isPopup && (
        <Popup
          isSuccessfull={successInfo.isSuccessfull}
          text={successInfo.text}
        />
      )}
    </form>
  );
};

export default UploadForm;
