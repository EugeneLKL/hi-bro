import React, { useState, useRef, useEffect, useCallback } from "react";
import HikingForm from "../common/HikingForm";
import Confirmation from "../common/Confirmation";
import { toast } from "react-toastify";
import axios from "axios";
import { ShareAltOutlined, StopOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined, FacebookOutlined, InstagramOutlined, LinkOutlined } from "@ant-design/icons";
import styled from "styled-components";

const ShareIcon = styled(ShareAltOutlined)`
  margin-right: 10px;
`;

const StopIcon = styled(StopOutlined)`
  margin-right: 10px;
`;

const OptionIcon = styled(EllipsisOutlined)`
  margin-right: 10px;
  transform: rotate(90deg) translateX(-5px);
  font-size: 20px;
  font-weight: bold;
`;

const EditIcon = styled(EditOutlined)`
  margin-right: 10px;
`;

const DeleteIcon = styled(DeleteOutlined)`
  margin-right: 10px;
`;

const FacebookIcon = styled(FacebookOutlined)`
  margin-right: 10px;
`;  

const InstagramIcon = styled(InstagramOutlined)`
  margin-right: 10px;
`;

const LinkIcon = styled(LinkOutlined)`
  margin-right: 10px;
`;

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
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalReport, setShowModalReport] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const dialogRef = useRef(null);
  const editFormRef = useRef(null);
  const reportFormRef = useRef(null);

  const handleOptionClick = () => {
    setOptionDropdownOpen(!optionDropdownOpen);
  };

  const handleShareClick = () => {
    setShareDropdownOpen(!shareDropdownOpen);
  };

  const handleCancel = useCallback(() => {
    setShowModalDelete(false);
  }, []);

  const handleReportButtonClick = useCallback(() => {
    setReportDialogOpen(true);
    console.log("Report button clicked");
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

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    if (!showModalEdit) {
      setShowModalEdit(true);
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
      const newPostData = {
        title: newTitle,
        content: newContent,
        imageUrl,
      };
      const response = await axios.patch(`/api/posts/${postId}`, newPostData);

      console.log("Post edited:", response.data);

      toast.success("Post edited successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });

      handleEditDialogClose();

      // add delaytime to reload page
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit post", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });
    }
  };

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false);
    setShowModalEdit(false);
  }, []);

  const handleReportDialogClose = useCallback(() => {
    setReportDialogOpen(false);
    setShowModalReport(false);
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

  const handleClickOutside = useCallback((event) => {
    const isShareDropdownClick = event.target.closest(".share-option-list");
    const isOptionDropdownClick = event.target.closest(".options-option-list");

    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target) &&
      event.target.className !== "post-options" // Exclude the post-options button
    ) {
      setOptionDropdownOpen(false);
    }

    if (
      editFormRef.current &&
      !editFormRef.current.contains(event.target) &&
      event.target.className !== "post-options" // Exclude the post-options button
    ) {
      setEditDialogOpen(false);
    }

    if (
      reportFormRef.current &&
      !reportFormRef.current.contains(event.target) &&
      event.target.className !== "report-button" // Exclude the report button
    ) {
      setReportDialogOpen(false);
    }

    if (!isShareDropdownClick && !isOptionDropdownClick) {
      setOptionDropdownOpen(false);
      setShareDropdownOpen(false);
    }
  }, []);

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

  const handleReportTitleChange = useCallback((event) => {
    setReportTitle(event.target.value);
  }, []);

  const handleReportContentChange = useCallback((event) => {
    setReportContent(event.target.value);
  }, []);

  const handleReportFormSubmit = async (event) => {
    event.preventDefault();

    if (!showModalReport) {
      setShowModalReport(true);
      return;
    }

    try {
      const newReportData = {
        title: reportTitle,
        content: reportContent,
      };

      const response = await axios.post(
        `/api/posts/${postId}/report`,
        newReportData
      );

      toast.success("Report submitted", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });

      handleReportDialogClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit report", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });
    }
  }

  return (
    <div className="hiking-post">
      <button className="post-options" onClick={handleOptionClick}>
        <OptionIcon />
      </button>
      {optionDropdownOpen && (
        <ul className="options-option-list">
          <li onClick={handleEditButtonClick}>
            <EditIcon />
            <span>Edit</span>
          </li>
          <li onClick={handleDeleteButtonClick}>
            <DeleteIcon />
            <span>Delete</span>
          </li>
        </ul>
      )}
      {showModalEdit && (
        <Confirmation
          message="Are you sure you want to edit?"
          onCancel={handleEditDialogClose}
          onConfirm={handleEditFormSubmit}
        />
      )}
      {editDialogOpen && !showModalEdit && (
        <div className="dark-overlay">
          <div ref={editFormRef}>
            <HikingForm
              onCancel={handleEditDialogClose}
              onSubmit={handleEditFormSubmit}
              handleTitleChange={handleTitleChange}
              handleContentChange={handleContentChange}
              handleImageChange={handleImageChange}
              formTitle="Edit Post"
              leftBtn="Edit"
              contentPlaceholder="Enter new content text for your post (Required)"
              isUploadOpen={true}
              dialogRef={editFormRef} 
            />
          </div>
        </div>
      )}
      {showModalDelete && (
        <Confirmation
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
            <ShareIcon />
            <span>Share</span>
          </button>
          {shareDropdownOpen && (
            <ul className="share-option-list">
              <li onClick={shareFacebook}>
                <FacebookIcon />
                <span>Facebook</span>
              </li>
              <li onClick={shareInstagram}>
                <InstagramIcon />
                <span>Instagram</span>
              </li>
              <li onClick={shareLink}>
                <LinkIcon />
                <span>Link</span>
              </li>
            </ul>
          )}

          <button className="report-button" onClick={handleReportButtonClick}>
            <StopIcon />
            <span>Report</span>
          </button>
          {showModalReport && (
            <Confirmation
              message="Are you sure you want to report?"
              onCancel={handleReportDialogClose}
              onConfirm={handleReportFormSubmit}
            />
          )}
          {reportDialogOpen && !showModalReport && (
            <div className="dark-overlay">
              <div ref={reportFormRef}>
                <HikingForm
                  onCancel={handleReportDialogClose}
                  onSubmit={handleReportFormSubmit}
                  handleTitleChange={handleReportTitleChange}
                  handleContentChange={handleReportContentChange}
                  formTitle="Report Post"
                  leftBtn="Report"
                  contentPlaceholder="Enter valid reasons for your report (Required)"
                  isUploadOpen={false}
                  dialogRef={reportFormRef} 
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HikingPostDetails;
