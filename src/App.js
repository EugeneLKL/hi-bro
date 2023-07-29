import HikingDiscussion from "./pages/hikingDiscussion";
import "./hiking.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import SideBar from "./components/common/SideBar";
import PostPage from "./pages/hikingPost/[postId]";
import HikingTrails from "./pages/hikingTrails";

function App() {

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content-container">
          <SideBar />
          <Routes>
            <Route path="/hikingDiscussion" element={<HikingDiscussion />} />
            <Route path="/hikingPost/:postId" element={<PostPage />}/>
          </Routes>
          <Routes>
            <Route path="/hikingTrails" element={<HikingTrails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
