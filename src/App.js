import HikingDiscussion from "./pages/HikingDiscussion";
import "./hiking.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/common/navBar";
import SideBar from "./components/common/sideBar";

function App() {

  const sidebarLinks = [
    {
      to: "/discussion",
      icon: "discussionIcon.png",
      alt: "discussion icon",
      label: "Discussion",
    },
    {
      to: "/trails",
      icon: "trailsIcon.png",
      alt: "trails icon",
      label: "Trails",
    },
  ];

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content-container">
          <SideBar links={sidebarLinks} />
          <Routes>
            <Route path="/" element={<HikingDiscussion />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
