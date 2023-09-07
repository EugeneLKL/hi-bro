import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "react-query";

const HikingPostComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [displayedComments, setDisplayedComments] = useState(5);
  const [userImageUrl, setUserImageUrl] = useState([]);
  const [username, setUsername] = useState([]);

  const { data: commentsData, isLoading } = useQuery(
    ["comments", postId],
    async () => {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      console.log(response);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setComments(data);
        console.log(data);
      },
    }
  );

  const handleShowMore = () => {
    setDisplayedComments((prevCount) => prevCount + 10);
  };

  return (
    <div>
      {comments.slice(0, displayedComments).map((comment) => (
        <div key={comment.commentId}>
          <div className="comment">
            <div className="comment-header">
              <img
                className="profile-picture"
                src={comment.user.profileImage}
                alt="profile"
              />
              <h5 className="comment-username">{comment.user.userName}</h5>
            </div>
            <div className="comment-content">{comment.comment}</div>
          </div>
        </div>
      ))}
      {comments.length > displayedComments && (
        <button className="show-more-button" onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
};

export default HikingPostComments;
