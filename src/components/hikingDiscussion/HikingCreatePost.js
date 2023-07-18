import { useState, useRef, useEffect } from "react";
import HikingForm from "../common/HikingForm";
import Confirmation from "../common/Confirmation";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";

const HikingCreatePost = ({ profileImage }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
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

    if (!isConfirmationOpen) {
      setIsConfirmationOpen(true);
      return;
    }

    try {
      const formData = new FormData();

      images.forEach((image) => {
        formData.append("images", image);
      });

      const uploadResponse = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = uploadResponse.data.imageUrl;

      const newPostData = { title, content, imageUrl };
      const response = await axios.post("/api/posts", newPostData);

      console.log("New post created:", response.data);

      toast.success("Post created successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });

      setTitle("");
      setContent("");
      handleDialogClose();

      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });
    }
  };

  const handlePostButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsConfirmationOpen(false);
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
      <button className="create-post-box-button" onClick={handlePostButtonClick}>
        Create Post
      </button>
      {isConfirmationOpen && (
        <Confirmation
          message="Are you sure you want to post?"
          onCancel={handleDialogClose}
          onConfirm={handleFormSubmit}
        />
      )}
      {isDialogOpen && !isConfirmationOpen && (
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
