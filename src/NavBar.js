const NavBar = ({ title, links, profileIcon }) => {
  return (
    <nav className="navbar">
      <h1>{title}</h1>
      <div className="links">
        {links.map((link) => (
          <a key={link.href} style={{ width: link.width }} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <div className="profile">
        <a href="/profile">
          <img
            style={{ width: "40px", height: "40px" }}
            src={profileIcon}
            alt="profile icon"
          />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
