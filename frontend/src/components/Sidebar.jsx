import { NavLink } from "react-router-dom";
import { Home, Headphones, User } from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  const username = JSON.parse(localStorage.getItem("user"))?.username;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-logo">Voxaro</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          <Home className="sidebar-icon" />
          <span className="sidebar-text">Home</span>
        </NavLink>
        <NavLink to="/listening-quiz" className="sidebar-link">
          <Headphones className="sidebar-icon" />
          <span className="sidebar-text">Listening Quiz</span>
        </NavLink>
        <NavLink to="/profile" className="sidebar-link">
          <User className="sidebar-icon" />
          <span className="sidebar-text">Profile</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        {username && (
          <span className="sidebar-username">{username}</span>
        )}
        <NavLink
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }}
          to="/login"
          className="sidebar-link logout-link"
        >
          Log Out
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
