import axios from "axios";
import { useState, useEffect } from "react";

const HikingPostComments = ({ postId }) => {
  const [comments, setComments] = useState(undefined);
  const [displayedComments, setDisplayedComments] = useState(5);
  const profileImage = "/img/profileIcon.png";
  const username = "Steve";

  const fetchComments = async () => {
    try {
      let commentsUrl = `/api/posts/${postId}/comments`;
      const response = await axios.get(commentsUrl);
      setComments(response.data);
    } catch (error) {
      console.error(error);
      // Handle the error or display an error message
    }
  };

  if (comments === undefined) {
    fetchComments();
  }

  useEffect(() => {
    fetchComments();
  });

  const handleShowMore = () => {
    setDisplayedComments((prevCount) => prevCount + 10);
  };

  return (
    <div>
      {comments &&
        comments.slice(0, displayedComments).map((comment) => (
          <div key={comment.commentId}>
            <div className="comment">
              <div className="comment-header">
                <img src={profileImage} alt="profile" />
                <h5 className="comment-username">{username}</h5>
              </div>
              <div className="comment-content">{comment.comment}</div>
            </div>
          </div>
        ))}
      {comments && comments.length > displayedComments && (
        <button className="show-more-button" onClick={handleShowMore}>Show More</button>
      )}
    </div>
  );
};

export default HikingPostComments;
