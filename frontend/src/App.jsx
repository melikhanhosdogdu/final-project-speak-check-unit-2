import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import FeedPage from "../src/features/feed/FeedPage.jsx";
import Login from "./features/auth/Login.jsx";
import SignUp from "./features/auth/SignUp.jsx";
import ListeningPage from "./features/quiz/ListenningPage.jsx";
import GameRoomPage from "./features/game-room/GameRoomPage.jsx";
import ProfilePage from "./features/profile/ProfilePage.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();
  const isAuth =
    location.pathname === "/login" || location.pathname === "/signup";
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!user && token) {
    localStorage.removeItem("token");
  }
  if (token && user && isAuth) {
    window.location.href = "/";
  }

  return (
    <>
      {!isAuth && token && <Sidebar />}
      <Routes>
        {token && (
          <>
            <Route path="/" element={<FeedPage />} />
            <Route path="/listening-quiz" element={<ListeningPage />} />
            <Route path="/game-room" element={<GameRoomPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </>
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={<Login />} />
      </Routes>
      <Footer isAuth={isAuth} />
      <ToastContainer />
    </>
  );
}

export default App;
