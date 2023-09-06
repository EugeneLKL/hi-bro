import HikingVote from "../components/hikingPost/HikingVote";
import HikingPostDetails from "../components/hikingPost/HikingPostDetails";
import HikingCreateComment from "../components/hikingPost/HikingCreateComment";
import HikingPostComments from "../components/hikingPost/HikingPostComments";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import SideBar from "../components/common/SideBar";

const PostPage = () => {
  const { postId } = useParams();
  const profileImage = "/img/profileIcon.png";
  const [posts, setPosts] = useState(undefined);
  const [comments, setComments] = useState(undefined);
  const navigate = useNavigate();

  const username = "Steve";

  const handleDelete = async () => {
    try {
      // Send a DELETE request to the server using the postId from the URL
      await axios.delete(`/api/posts/${postId}`);
      // Redirect to the main page
      navigate("/hikingDiscussion");
    } catch (error) {
      console.error(error);
      // Handle the error or display an error message
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let postsUrl = `/api/posts/${postId}`;
        const response = await axios.get(postsUrl);
        setPosts(response.data);
      } catch (error) {
        console.error(error);
        // Handle the error or display an error message
      }
    };

    fetchPosts();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        let commentsUrl = `/api/posts/${postId}/comments`;
        const response = await axios.get(commentsUrl);
        setComments(response.data);
      } catch (error) {
        console.error(error);
        // Handle the error or display an error message
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return (
    <div className="flex flex-row w-full">
      <SideBar />
      <div className="main-content">
        <div className="centered-content">
          <HikingVote postId={postId} />
          {posts &&
            posts.map((post) => (
              <HikingPostDetails
                key={post.postId}
                postId={post.postId}
                username={username} //post.username
                title={post.title}
                content={post.content}
                imageUrl={post.imageUrl}
                isDetail={true}
                onDelete={handleDelete}
              />
            ))}
          <HikingCreateComment profileImage={profileImage} postId={postId} />
          <br />
          <h2>Comments</h2>
          <HikingPostComments postId={postId} comments={comments} />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default PostPage;
