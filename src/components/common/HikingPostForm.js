import "react-toastify/dist/ReactToastify.css";

const HikingPostForm = ({
  onCancel,
  onSubmit,
  handleTitleChange,
  handleContentChange,
  handleImageChange,
  title,
  content,
  formTitle,
  leftBtn,
}) => {

  return (
    <div className="post-form">
      <h2>{formTitle}</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <input
            className="style-input"
            placeholder="Enter title (Max 300 characters)"
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            maxLength={300}
            required
          />
        </div>
        <div className="form-row">
          <textarea
            className="style-textarea"
            placeholder="Text (Required)"
            type="text"
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={5}
            required
          />
        </div>
        <div className="form-actions">
          <input
            className="upload-button"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <button className="form-post-button" type="submit">
            {leftBtn}
          </button>
          <button className="form-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HikingPostForm;
