import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Redirect,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAuth } from "./AuthContext";
import HikingDiscussion from "./pages/hikingDiscussion";
import "./hiking.css";
import NavBar from "./components/common/NavBar";
import SideBar from "./components/common/SideBar";
import PostPage from "./pages/[postId]";
import HikingTrails from "./pages/hikingTrails";
import HikingSaved from "./pages/hikingSaved";
import TrailPage from "./pages/[trailId]";
import SuggestTrail from "./pages/suggestTrail";
import Connector from "./pages/connector";
import Profile from "./pages/Profile";
// import EditProfile from "./pages/editProfile";
import TravelRequestment from "./pages/TravelRequestment";
import TravelPost from "./pages/TravelPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SideBarCK from "./components/common/sideBarCK";
// import EditProfile from "./pages/editProfile";
import "./App.css";
import "./Account.css";
import "./Profile.css";
import "./TravelBuddy.css";

const queryClient = new QueryClient();

function App() {
  const { userId, isLoggedIn, profileImageUrl } = useAuth();
  const [sidebarE, setSidebarE] = useState(false);
  const [sidebarC, setSidebarC] = useState(false);
  const [connector, setConnector] = useState(false);

  const allowedPaths = ['/connector', '/register', '/'];

  useEffect(() => {
    const currentPath = window.location.pathname;
    const isAllowedPath = allowedPaths.includes(currentPath);

    setConnector(!isAllowedPath);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          {isLoggedIn && connector && <NavBar userImageUrl={profileImageUrl} />}
          <div className="content-container">
            <Routes>
              <Route path="/Register" element={<Register />} />
              <Route path="/" element={<Login />} />
              <Route path="/connector" element={<Connector />} />
              {isLoggedIn ? (
                <Route>
                  {/* Hide the sidebar when the Profile is rendered */}
                  <Route path="/profile/:userId" element={<Profile />} />
                  {/* <Route path="/EditProfile" component={EditProfile} /> */}
                  <Route
                    path="/TravelRequestment"
                    element={<TravelRequestment />}
                  />
                  <Route path="/TravelPost" element={<TravelPost />} />
                  <Route
                    path="/hikingDiscussion"
                    element={<HikingDiscussion />}
                  />
                  <Route
                    path="/hikingDiscussion/hikingPost/:postId"
                    element={<PostPage />}
                  />
                  <Route path="/hikingTrails" element={<HikingTrails />} />
                  <Route
                    path="/hikingTrails/:trailId"
                    element={<TrailPage />}
                  />
                  <Route
                    path="/hikingTrails/suggest-trail"
                    element={<SuggestTrail />}
                  />
                  <Route path="/hikingTrails/saved" element={<HikingSaved />} />
                </Route>
              ) : (
                <Route path="/" element={<Login />} />
              )}
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
