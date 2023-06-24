import { useEffect, useState } from "react";
import axios from "axios";
import HikingCreatePost from "../components/hikingDiscussion/hikingCreatePost";
import HikingFilterPost from "../components/hikingDiscussion/hikingFilterPost";
import HikingDisplayPost from "../components/hikingDiscussion/hikingDisplayPost";
import { ToastContainer } from "react-toastify";

const HikingDiscussion = () => {
  const profileImage = "/profileIcon.png";
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error(error);
        // Handle the error or display an error message
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="main-content">
      <div className="centered-content">
        {/* Profile image should be actual user profile image */}
        <HikingCreatePost profileImage={profileImage} />
        <HikingFilterPost />
        {posts.map((post) => (
          <HikingDisplayPost
            key={post.postId}
            username={post.username}
            title={post.title}
            content={post.content}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default HikingDiscussion;