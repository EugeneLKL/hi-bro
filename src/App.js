import HikingDiscussion from "./pages/hikingDiscussion";
import "./hiking.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import SideBar from "./components/common/SideBar";
import PostPage from "./pages/hikingPost/[postId]";

function App() {

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content-container">
          <SideBar />
          <Routes>
            <Route path="/" element={<HikingDiscussion />} />
            <Route path="/hikingPost/:postId" element={<PostPage />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
