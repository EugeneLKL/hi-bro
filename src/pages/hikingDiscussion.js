import { useEffect, useState } from "react";
import axios from "axios";
import HikingCreatePost from "../components/hikingDiscussion/HikingCreatePost";
import HikingFilterPost from "../components/hikingDiscussion/HikingFilterPost";
import HikingDisplayPost from "../components/hikingDiscussion/HikingDisplayPost";
import { ToastContainer } from "react-toastify";
import SearchBar from "../components/common/SearchBar";

const HikingDiscussion = () => {
  const profileImage = "/img/profileIcon.png";
  const [posts, setPosts] = useState(undefined);

  // fetch /api/posts/:postId
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let posts = "/api/posts";
        const response = await axios.get(posts);
        setPosts(response.data);
      } catch (error) {
        console.error(error);
        // Handle the error or display an error message
      }
    };
    if (!posts) {
      fetchPosts();
    }
  }, [posts]);

  return (
    <div className="main-content">
      <div className="centered-content">
        <SearchBar setPosts={setPosts} />
        {/* Profile image should be actual user profile image */}
        <HikingCreatePost
          profileImage={profileImage}
        />
        <HikingFilterPost />
        {posts &&
          posts.map((post) => (
            <HikingDisplayPost
              key={post.postId}
              postId={post.postId}
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
