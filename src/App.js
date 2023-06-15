import NavBar from "./navBar";
import SideBar from "./sideBar";
import HikingCreatePost from "./hikingCreatePost";
import "./hiking.css";

function App() {
  const profileImage = "/profileIcon.png";

  const NavbarLinks = [
    { href: "/", label: "Hiking", width: "140px" },
    { href: "/", label: "Travel Buddy", width: "140px" },
  ];

  const sidebarLinks = [
    {
      url: "/",
      icon: "discussion.png",
      alt: "discussion icon",
      label: "Discussion",
    },
    {
      url: "/",
      icon: "trails.png",
      alt: "trails icon",
      label: "Trails",
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
        <div className="sidebar-container">
          <SideBar links={sidebarLinks} />
        </div>
        <div className="main-content">
          <div className="centered-content">
            {/* Profile image should be actual user profile image */}
            <HikingCreatePost profileImage={profileImage} />
          </div>
          {/* Other app content */}
        </div>
      </div>
    </div>
  );
  
}

export default App;
