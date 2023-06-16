const HikingPost = ({ username, title, content, imageUrl }) => {
  return (
    // Link to specific post page
    <a href="/" className="post-link"> 
      <div className="hiking-post">
        <h5 className="hiking-post-username">{username}</h5>
        <h3 className="hiking-post-title">{title}</h3>
        <div className="hiking-post-content">{content}</div>
        {imageUrl && (
          <img className="hiking-post-image" src={imageUrl} alt="Post Image" />
        )}
      </div>
    </a>
  );
};

export default HikingPost;
