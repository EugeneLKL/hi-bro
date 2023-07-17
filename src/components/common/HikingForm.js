import "react-toastify/dist/ReactToastify.css";

const HikingForm = ({
  onCancel,
  onSubmit,
  isUploadOpen,
  handleTitleChange,
  handleContentChange,
  handleImageChange,
  title,
  content,
  formTitle,
  leftBtn,
  contentPlaceholder,
}) => {
  return (
    <div className="hiking-discussion-form">
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
            placeholder={contentPlaceholder}
            type="text"
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={5}
            required
          />
        </div>
        <div className="form-actions">
          {isUploadOpen && (
            <div>
              <input
                className="upload-button"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>
          )}
          <button className="form-hiking-discussion-button" type="submit">
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

export default HikingForm;
