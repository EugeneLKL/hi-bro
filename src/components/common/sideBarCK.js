import { Link } from "react-router-dom";
import { BsFillSignpostSplitFill } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'

const SideBar = ({ links }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-link">
        <Link to="/TravelPost">
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              gap: "1rem",
            }}
          > <BsFillSignpostSplitFill/> Post</span>
        </Link>
      </div>
      <div className="sidebar-link">
      <Link to="/TravelRequestment">
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              gap: "1rem",
            }}
          > <FiUsers/> Requestment</span>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
