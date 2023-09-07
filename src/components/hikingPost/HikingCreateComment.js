import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Confirmation from "../common/HikingConfirmation";
import { useAuth } from "../../AuthContext";
import { useQuery } from "react-query";

const HikingCreateComment = ({ postId, profileImage }) => {
  const [comment, setComment] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { userId } = useAuth();
  const [userImageUrl, setUserImageUrl] = useState("");

  const { data: userData, isLoading } = useQuery(
    ["user", userId],
    async () => {
      const response = await axios.get(`/api/getUserInfo/${userId}`);
      console.log(response);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setUserImageUrl(data.profileImage);
      },
    }
  );

  const handleCommentChange = (event) => setComment(event.target.value);

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    if (!isConfirmationOpen) {
      setIsConfirmationOpen(true);
      return;
    }

    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        userId,
        comment,
      });

      console.log(response.data);

      // Show toast message only after confirmation
      toast.success("Comment posted successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });

      setTimeout(function () {
        window.location.reload();
      }, 2000);

      setComment("");
      setIsConfirmationOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className="comment-form">
      <img className="profile-picture" src={userImageUrl} alt="User profile" />
      <form onSubmit={handleSubmitComment}>
        <textarea
          className="comment-input"
          placeholder="Write a comment..."
          value={comment}
          onChange={handleCommentChange}
        ></textarea>
        <button className="comment-button" type="submit">
          Comment
        </button>
      </form>
      {isConfirmationOpen && (
        <Confirmation
          message="Are you sure you want to post the comment?"
          onCancel={handleCancelConfirmation}
          onConfirm={handleSubmitComment}
        />
      )}
    </div>
  );
};

export default HikingCreateComment;
