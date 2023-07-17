import { useState, useRef, useEffect } from "react";
import HikingForm from "../common/HikingForm";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";

const HikingCreatePost = ({ profileImage }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setIsDialogOpen(false);
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        setIsDialogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      // Append all images to the form data without a unique name
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Upload the images to the backend
      const uploadResponse = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = uploadResponse.data.imageUrl; // Get the URLs of the uploaded images

      // Create a new post with the image URLs
      const newPostData = { title, content, imageUrl };
      const response = await axios.post("/api/posts", newPostData);

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
      handleDialogClose();

      // Reload the page
      setTimeout(function () {
        window.location.reload();
      }, 2000);
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

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

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

  return (
    <div className="hiking-create-post">
      <img className="profile-picture" src={profileImage} alt="User profile" />
      <button className="create-post-box-button" onClick={handleButtonClick}>
        Create Post
      </button>
      {isDialogOpen && (
        <div className="dark-overlay">
          <div ref={dialogRef}>
            <HikingForm
              onCancel={handleDialogClose}
              onSubmit={handleFormSubmit}
              handleTitleChange={handleTitleChange}
              handleContentChange={handleContentChange}
              handleImageChange={handleImageChange}
              formTitle="Create Post"
              leftBtn="Post"
              contentPlaceholder="Enter content text for your post (Required)"
              isUploadOpen={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HikingCreatePost;
