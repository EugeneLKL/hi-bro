import { useEffect, useState } from "react";
import axios from "axios";
import HikingCreatePost from "../components/hikingDiscussion/HikingCreatePost";
import HikingSortPost from "../components/hikingDiscussion/HikingSortPost";
import HikingDisplayPost from "../components/hikingDiscussion/HikingDisplayPost";
import { ToastContainer } from "react-toastify";
import SearchBar from "../components/common/SearchBar";

const HikingDiscussion = () => {
  const profileImage = "/img/profileIcon.png";
  const [posts, setPosts] = useState(undefined);
  const [sortedPosts, setSortedPosts] = useState(undefined);
  
  const currentUrl = window.location.href;
  const searchApplied = currentUrl.includes("search");

  const handleSortChange = (sortValue) => {
    if (sortValue === "new") {
      setSortedPosts([...posts].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)));
    } else if (sortValue === "old") {
      setSortedPosts([...posts].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)));
    } else if (sortValue === "hot") {
      setSortedPosts([...posts].sort((a, b) => (a.voteCounter > b.voteCounter ? -1 : 1)));
    }
  };

  const fetchPosts = async () => {
    try {
      let postsUrl = "/api/posts";
      const response = await axios.get(postsUrl);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      // Handle the error or display an error message
    }
  };

  //fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // If searchApplied is false, then we want to display all posts 
  useEffect(() => {
    if (!searchApplied) {
      fetchPosts();
    }
  }, [searchApplied]);

  useEffect(() => {
    if (posts) {
      setSortedPosts([...posts].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)));
    }
  }, [posts]);

  return (
    <div className="main-content">
      <div className="centered-content">
        <SearchBar setPosts={setPosts} />
        <HikingCreatePost profileImage={profileImage} />
        <HikingSortPost onSortChange={handleSortChange} />
        {sortedPosts &&
          sortedPosts.map((post) => (
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