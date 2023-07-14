import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-link">
        <Link to="/">
          <img src="/img/discussionIcon.png" alt="discussion icon" />
          <span>Discussion</span>
        </Link>
      </div>
      <div className="sidebar-link">
        <Link to="/trails">
          <img src="/img/trailsIcon.png" alt="trails icon" />
          <span>Trails</span>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
