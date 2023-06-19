import { useState } from "react";
import HikingPostForm from "./hikingPostForm";

const HikingCreatePost = ({ profileImage }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="hiking-create-post">
      <img className="profile-picture" src={profileImage} alt="User profile" />
      <button className="create-post-box-button" onClick={handleButtonClick}>
        Create Post
      </button>
      {isDialogOpen && (
        <div className="dark-overlay">
          <HikingPostForm onCancel={handleDialogClose} onPost={handleDialogClose} />
        </div>
      )}
    </div>
  );
};

export default HikingCreatePost;
