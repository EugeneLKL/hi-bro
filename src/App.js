import HikingDiscussion from "./pages/hikingDiscussion";
import "./hiking.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import SideBar from "./components/common/SideBar";
import PostPage from "./pages/[postId]";
import HikingTrails from "./pages/hikingTrails";
import HikingSaved from "./pages/hikingSaved";
import TrailPage from "./pages/[trailId]";
import { QueryClient, QueryClientProvider } from "react-query";
import SuggestTrail from "./pages/suggestTrail";
import Connector from "./pages/connector";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          <NavBar />
          <div className="content-container">
            <SideBar />
            <Routes>
              {/* Discussion Module */}
              <Route path="/hikingDiscussion" element={<HikingDiscussion />} />
              <Route
                path="/hikingDiscussion/hikingPost/:postId"
                element={<PostPage />}
              />
              {/* Trail module */}
              <Route path="/hikingTrails" element={<HikingTrails />} />
              <Route path="/hikingTrails/:trailId" element={<TrailPage />} />
              <Route
                path="/hikingTrails/suggest-trail"
                element={<SuggestTrail />}
              />
              <Route path="/hikingTrails/saved" element={<HikingSaved />} />
              <Route path="/travelBuddy" element={<Connector />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
