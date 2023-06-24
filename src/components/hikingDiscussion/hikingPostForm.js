import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HikingPostForm = ({ onCancel, onPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const formData = { title, content, imageUrl: '' };
      const file = images[0];
  
      // Create a new post
      const response = await axios.post("/api/posts", { formData });
  
      // Get secure URL from the server
      // const { data } = await axios.get("/s3Url");

      // // Post the image directly to the S3 bucket
      // await axios.put(data.url, file)

      // const imageUrl = data.url.split("?")[0];
      // formData.imageUrl = imageUrl;
  
      // // Store the URL in the PostgreSQL database using Prisma
      // await axios.put(`/api/posts/${response.data.postId}`, { imageUrl });
  
      // Handle the response or perform additional actions
      console.log("New post created:", response.data);
  
      // Show toast message
      toast.success("Post created successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });
  
      // Reset the form fields
      setTitle("");
      setContent("");
  
      // Close the dialog box
      onPost();
    } catch (error) {
      console.error(error);
      // Handle the error or display an error message
      toast.error("Failed to create post", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });
    }
  };
  
  return (
    <div className="post-form">
      <h2>Create a Post</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-row">
          <input
            className="style-input"
            placeholder="Enter title (Max 75 characters)"
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            maxLength={75}
            required
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
            maxLength={300}
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
            Post
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





