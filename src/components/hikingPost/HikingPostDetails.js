import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaFacebook, FaInstagram, FaLink } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import HikingPostForm from "../common/HikingPostForm";
import ConfirmationModal from "../common/Confirmation";
import { toast } from "react-toastify";
import axios from "axios";

const HikingPostDetails = ({
  postId,
  imageUrl,
  username,
  title,
  content,
  isDetail,
  onDelete,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const dialogRef = useRef(null);

  const handleOptionClick = () => {
    setOptionDropdownOpen(!optionDropdownOpen);
  };

  const handleShareClick = () => {
    setShareDropdownOpen(!shareDropdownOpen);
  };

  const handleCancel = useCallback(() => {
    setShowModalDelete(false);
  }, []);

  const handleEditButtonClick = useCallback(() => {
    setEditDialogOpen(true);
  }, []);

  const handleDeleteButtonClick = useCallback(() => {
    setShowModalDelete(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setShowModalDelete(false);
    onDelete(postId);
  }, [onDelete, postId]);

  const handlePrevImage = useCallback(
    (e) => {
      e.preventDefault();
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? imageUrl.length - 1 : prevIndex - 1
      );
    },
    [imageUrl.length]
  );

  const handleNextImage = useCallback(
    (e) => {
      e.preventDefault();
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageUrl.length - 1 ? 0 : prevIndex + 1
      );
    },
    [imageUrl.length]
  );

  const shareFacebook = useCallback((e) => {
    e.preventDefault();
    window.open(
      "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(window.location.href),
      "facebook-share-dialog",
      "width=800,height=600"
    );
  }, []);

  const shareInstagram = useCallback((e) => {
    e.preventDefault();
    window.open(
      "https://www.instagram.com/sharer/sharer.php?u=" +
        encodeURIComponent(window.location.href),
      "instagram-share-dialog",
      "width=800,height=600"
    );
  }, []);

  const shareLink = useCallback((e) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
  }, []);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [images, setImages] = useState([]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();

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
        const newPostData = {
          title: newTitle,
          content: newContent,
          imageUrl,
        };
        const response = await axios.patch(`/api/posts/${postId}`, newPostData);

        console.log("Post edited:", response.data);
        window.location.reload();
      } catch (error) {
        console.error(error);
        toast.error("Failed to edit post", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          transition: toast.slideIn,
        });
      }
    },
    [images, postId, newTitle, newContent]
  );

  const handleDialogClose = useCallback(() => {
    setEditDialogOpen(false);
  }, []);

  const handleTitleChange = useCallback((event) => {
    setNewTitle(event.target.value);
  }, []);

  const handleContentChange = useCallback((event) => {
    setNewContent(event.target.value);
  }, []);

  const handleImageChange = useCallback((event) => {
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
  }, []);

  const handleClickOutside = useCallback(
    (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setEditDialogOpen(false);
      }
    },
    [dialogRef]
  );

  const handleKeyPress = useCallback((event) => {
    if (event.key === "Escape") {
      setEditDialogOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleClickOutside, handleKeyPress]);

  return (
    <div className="hiking-post">
      <button className="post-options">
        <img
          src="/img/optionsIcon.png"
          alt="options icon"
          onClick={handleOptionClick}
        />
      </button>
      {optionDropdownOpen && (
        <ul className="options-option-list">
          <li onClick={handleEditButtonClick}>
            <MdEdit className="option-icon" />
            <span>Edit</span>
          </li>
          <li onClick={handleDeleteButtonClick}>
            <MdDelete className="option-icon" />
            <span>Delete</span>
          </li>
        </ul>
      )}
      {editDialogOpen && (
        <div className="dark-overlay">
          <div ref={dialogRef}>
            <HikingPostForm
              onCancel={handleDialogClose}
              onSubmit={handleFormSubmit}
              handleTitleChange={handleTitleChange}
              handleContentChange={handleContentChange}
              handleImageChange={handleImageChange}
              formTitle="Edit Post"
              leftBtn="Edit"
            />
          </div>
        </div>
      )}
      {showModalDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancel}
        />
      )}
      <div className="hiking-post-header">
        <img
          className="profile-image"
          src="/img/profileIcon.png"
          alt="profile"
        />
        <h5 className="hiking-post-username">{username}</h5>
      </div>
      <h3 className="hiking-post-title">{title}</h3>
      <div className="hiking-post-content">{content}</div>
      {imageUrl && imageUrl.length > 0 && (
        <div className="hiking-post-images">
          <div className="image-slider">
            <button
              className="arrow-button prev-button"
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
            >
              &lt;
            </button>
            <img
              className="hiking-post-image"
              src={imageUrl[currentImageIndex]}
              alt={`Post ${currentImageIndex + 1}`}
            />
            <button
              className="arrow-button next-button"
              onClick={handleNextImage}
              disabled={currentImageIndex === imageUrl.length - 1}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
      {isDetail && (
        <div className="post-buttons">
          <button className="share-button" onClick={handleShareClick}>
            <img src="/img/shareIcon.png" alt="share icon" />
            <span>Share</span>
          </button>
          {shareDropdownOpen && (
            <ul className="share-option-list">
              <li onClick={shareFacebook}>
                <FaFacebook className="share-icon" />
                <span>Facebook</span>
              </li>
              <li onClick={shareInstagram}>
                <FaInstagram className="share-icon" />
                <span>Instagram</span>
              </li>
              <li onClick={shareLink}>
                <FaLink className="share-icon" />
                <span>Link</span>
              </li>
            </ul>
          )}

          <button className="report-button">
            <img src="/img/reportIcon.png" alt="report icon" />
            <span>Report</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HikingPostDetails;
