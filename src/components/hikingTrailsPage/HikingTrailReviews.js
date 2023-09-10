import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

const HikingTrailReviews = ({ trailId }) => {
  const [reviews, setReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState(5);
  const [userImageUrl, setUserImageUrl] = useState([]);
  const [username, setUsername] = useState([]);

  const { data: reviewsData, isLoading } = useQuery(
    ["reviews", trailId],
    async () => {
      const response = await axios.get(`/api/trails/${trailId}/reviews`);
      console.log(response);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setReviews(data);
        console.log(data);
      },
    }
  );

  const handleShowMore = () => {
    setDisplayedReviews((prevCount) => prevCount + 10);
  };

  return (
    <div>
      {reviews.slice(0, displayedReviews).map((review) => (
        <div key={review.reviewId}>
          <div className="review">
            <div className="review-header">
              <img
                className="profile-picture"
                src={review.user.profileImage}
                alt="profile"
              />
              <h5 className="review-username">{review.user.userName}</h5>
            </div>
            <h1 className="review-title">{review.reviewTitle}</h1>
            <div className="review-content">{review.reviewContent}</div>
          </div>
        </div>
      ))}
      {reviews.length > displayedReviews && (
        <button className="show-more-button" onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
};

export default HikingTrailReviews;
