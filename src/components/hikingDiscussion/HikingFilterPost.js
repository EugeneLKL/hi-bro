const HikingFilterPost = () => {
    const handleButtonClick = () => {
      // Handle button click event here
      console.log("Button clicked!");
    };
  
    return (
      <div className="hiking-filter-post">
        <button id="filter-latest" className="filter-post-box-button" onClick={handleButtonClick}>
          Latest
        </button>
        <button id="filter-oldest" className="filter-post-box-button" onClick={handleButtonClick}>
          Oldest
        </button>
        <button id="filter-most-upvoted" className="filter-post-box-button" onClick={handleButtonClick}>
          Most Upvoted
        </button>
      </div>
    );
  };
  
  export default HikingFilterPost;
  
