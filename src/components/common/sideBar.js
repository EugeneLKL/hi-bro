import { Link } from "react-router-dom";

const SideBar = ({ links }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-link">
        <Link to="/discussion">
          <img src="discussionIcon.png" alt="discussion icon" />
          <span>Discussion</span>
        </Link>
      </div>
      <div className="sidebar-link">
        <Link to="/trails">
          <img src="trailsIcon.png" alt="trails icon" />
          <span>Trails</span>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
