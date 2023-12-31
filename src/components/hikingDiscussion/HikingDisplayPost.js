import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HikingVote from "../hikingPost/HikingVote";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const discussionContainer = `
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

//TODO - Add username
const HikingPost = ({ title, content, imageUrl, postId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userImageUrl, setUserImageUrl] = useState("");
  const [username, setUsername] = useState("");

  const { data: postData, isLoading } = useQuery(
    ["post", postId],
    async () => {
      const response = await axios.get(`/api/posts/${postId}`);
      console.log(response);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setUserImageUrl(data[0].user.profileImage); 
        setUsername(data[0].user.userName); 
      },
    }
  );

  const handlePrevImage = (event) => {
    event.preventDefault();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrl.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (event) => {
    event.preventDefault();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrl.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="hiking-post-container">
      <HikingVote postId={postId} containerStyle={discussionContainer} />
      <Link to={`hikingPost/${postId}`} className="post-link">
        <div className="hiking-post">
          <div className="hiking-post-header">
            <img className="profile-image" src={userImageUrl} alt="profile" />
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
        </div>
      </Link>
    </div>
  );
};

export default HikingPost;
