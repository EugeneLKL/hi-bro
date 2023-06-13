const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-link">
        <a href="/">
          <img src="discussion.png" alt="discussion icon" />
          <span>Discussion</span>
        </a>
      </div>
      <div className="sidebar-link">
        <a href="/">
          <img src="trails.png" alt="trails icon" />
          <span>Trails</span>
        </a>
      </div>
    </div>
  );
};

export default SideBar;
