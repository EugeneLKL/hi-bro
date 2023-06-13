const NavBar = () => {
  return (
    <nav className="navbar">
      <h1>Hi-Bro</h1>
      <div className="links">
        <a style={{ width: "90px" }} href="/">
          Hiking
        </a>
        <a style={{ width: "140px" }} href="/">
          Travel Buddy
        </a>
      </div>
      <div className="profile">
        <a href="/profile"><img style={{ width: "40px", height: "40px"  }} src='/profile.png' alt="profile icon " /></a>
      </div>
    </nav>
  );
};

export default NavBar;
