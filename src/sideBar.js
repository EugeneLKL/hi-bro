const SideBar = ({ links }) => {
  return (
    <div className="sidebar">
      {links.map((link) => (
        <div className="sidebar-link" key={link.url}>
          <a href={link.url}>
            <img src={link.icon} alt={link.alt} />
            <span>{link.label}</span>
          </a>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
