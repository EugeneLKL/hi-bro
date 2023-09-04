const HikingTrailReviews = (username, reviewTitle, reviewContent) => {
    return ( 
        <div className="flex flex-col mb-4">
            <div className="flex flex-row mb-4">
            <div>user image</div>
            <div>{username}</div>
            </div>
            <div>{reviewTitle}</div>
            <div>{reviewContent}</div>
        </div>
     );
}
 
export default HikingTrailReviews;