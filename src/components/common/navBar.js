import { Link } from "react-router-dom";

const NavBar = () => {
  const title = "Hi-Bro"
  const profileIcon = "./profileIcon.png"

  return (
    <nav className="navbar">
      <h1>{title}</h1>
      <div className="links">
        <Link to="/hiking">Hiking</Link>
        <Link to="/travelBuddy">Travel Buddy</Link>
      </div>
      <div className="profile">
        <Link to="/profile">
          <img
            style={{ width: "40px", height: "40px" }}
            src={profileIcon}
            alt="profile icon"
          />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
