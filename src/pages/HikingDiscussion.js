import NavBar from "../components/common/navBar";
import SideBar from "../components/common/sideBar";
import HikingCreatePost from "../components/hikingDiscussion/hikingCreatePost";
import HikingFilterPost from "../components/hikingDiscussion/hikingFilterPost";
import HikingDisplayPost from "../components/hikingDiscussion/hikingDisplayPost";

const HikingDiscussion = () => {
  const profileImage = "/profileIcon.png";

  const NavbarLinks = [
    { href: "/", label: "Hiking", width: "140px" },
    { href: "/", label: "Travel Buddy", width: "140px" },
  ];

  const sidebarLinks = [
    {
      url: "/",
      icon: "discussionIcon.png",
      alt: "discussion icon",
      label: "Discussion",
    },
    {
      url: "/",
      icon: "trailsIcon.png",
      alt: "trails icon",
      label: "Trails",
    },
  ];

  const posts = [
    {
      id: 1,
      username: "user1",
      title: "Post 1",
      content: "This is the content of post 1.",
      imageUrl: "tempPostImage.png",
    },
    {
      id: 2,
      username: "user2",
      title: "Post 2",
      content: "This is the content of post 2.",
      imageUrl: "tempPostImage.png",
    },
    {
      id: 3,
      username: "user3",
      title: "Post 3",
      content: "This is the content of post 3.",
      imageUrl: "tempPostImage.png",
    },
  ];

  return (
    <div className="app-container">
      <NavBar
        title="Hi-Bro"
        links={NavbarLinks}
        profileIcon="/profileIcon.png"
      />
      <div className="content-container">
        <SideBar links={sidebarLinks} />
        <div className="main-content">
          <div className="centered-content">
            {/* Profile image should be actual user profile image */}
            <HikingCreatePost profileImage={profileImage} />
            <HikingFilterPost />
            {posts.map((post) => (
              <HikingDisplayPost
                key={post.id}
                username={post.username}
                title={post.title}
                content={post.content}
                imageUrl={post.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HikingDiscussion;
