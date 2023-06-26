import { useState } from "react";

const HikingPost = ({ username, title, content, imageUrl }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <a href="/" className="post-link">
      <div className="hiking-post">
        <h5 className="hiking-post-username">{username}</h5>
        <h3 className="hiking-post-title">{title}</h3>
        <div className="hiking-post-content">{content}</div>
        {imageUrl && (
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
    </a>
  );
};

export default HikingPost;
