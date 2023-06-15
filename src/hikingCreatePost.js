const HikingCreatePost = ({ profileImage }) => {
    const handleButtonClick = () => {
      // Handle button click event here
      console.log("Button clicked!");
    };
  
    return (
      <div className="hiking-create-post">
        <img className="profile-picture" src={profileImage} alt="User profile" />
        <button className="create-post-box-button" onClick={handleButtonClick}>
          Create Post
        </button>
      </div>
    );
  };
  
  export default HikingCreatePost;
  