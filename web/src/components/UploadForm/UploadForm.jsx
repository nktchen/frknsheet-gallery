import style from "./UploadForm.module.css";
import Popup from "../assets/Popup/Popup.jsx";
import { useEffect, useState } from "react";

const UploadForm = () => {
  const [previews, setPreviews] = useState([]);
  const [isPopup, setIsPopup] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null); // null or {isSuccessfull: boolean, text: string}
  const now = new Date();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(newPreviews);
  };
  const showPopup = (isSuccessfull, text) => {
    setSuccessInfo({ isSuccessfull, text });
    setIsPopup(true);
    setTimeout(() => setIsPopup(false), 10000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const fetchURL = "http://127.0.0.1:5000/api/projects";

    fetch(fetchURL, {
      method: "POST",
      body: form,
    })
      .then(async (res) => {
        showPopup(res.ok, await res.text());
      })
      .catch((err) => {
        showPopup(false, err.message || "Ошибка загрузки");
      });
  };
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url)); // удаляем URLs от image preview
    };
  }, [previews]);

  return (
    <section className={style.projectWrapper}>
      <div className={style.imgWrapper}>
        {previews.map((preview, index) => (
          <img key={index} src={preview.url} alt={`preview ${index}`} />
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        method="post"
        encType="multipart/form-data"
        className={style.infoWrapper}
      >
        <input
          className={style.infoTitle}
          name="title"
          type="text"
          placeholder="Заголовок"
          required
          autoFocus
        />
        <p className="infoDate">
          {now.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <input
          className={style.infoDescription}
          name="description"
          type="text"
          placeholder="Описание"
        />
        <input
          id="image"
          name="image"
          type="file"
          multiple
          required
          onChange={handleImageChange}
        />
        <button type="submit">Добавить!</button>{" "}
        {/* <- disabled while uploading*/}
        {isPopup && (
          <Popup
            isSuccessfull={successInfo.isSuccessfull}
            text={successInfo.text}
          />
        )}
      </form>
    </section>
  );
};

export default UploadForm;
