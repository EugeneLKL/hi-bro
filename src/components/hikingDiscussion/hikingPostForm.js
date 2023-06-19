import { useState } from "react";

const HikingPostForm = ({ onCancel, onPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPost({ title, content });
  };

  return (
    <div className="post-form">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            className="style-input"
            placeholder="Enter title (Max 75 characters)"
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            maxLength={75}
          />
        </div>
        <div className="form-row">
          <textarea
            className="style-textarea"
            placeholder="Enter post content (Max 300 characters)"
            type="text"
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={5}
            maxLength={400}
          />
        </div>
        <div className="form-actions">
          <button className="form-post-button">Post</button>
          <button className="form-cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default HikingPostForm;
