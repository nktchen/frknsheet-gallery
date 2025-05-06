const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);
  const fetchURL = "http://127.0.0.1:5000/api/projects";
  fetch(fetchURL, {
    method: "POST",
    body: form,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
};

const UploadForm = () => {
  return (
    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
      <label htmlFor="title">Заголовок</label>
      <input id="title" name="title" type="text" required autoFocus />

      <label htmlFor="description">Описание</label>
      <input id="description" name="description" type="text" />

      <label htmlFor="image"></label>
      <input id="image" name="image" type="file" multiple required />

      <button type="submit">Добавить!</button>
    </form>
  );
};

export default UploadForm;
