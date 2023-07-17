import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const HikingCreateComment = ({ postId, profileImage }) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => setComment(event.target.value);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        comment: comment,
      });

      console.log(response.data);

      // Show toast message
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="comment-form">
      <img src={profileImage} alt="User profile" />
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
    </div>
  );
};

export default HikingCreateComment;
