import { NavLink } from "react-router-dom";
import "./ProfileHeader.css";
function ProfileHeader() {
  return (
    <header className="profile-header">
      <div className="profile-header-title-area">
        <h1 className="profile-title">Profile</h1>
        <div className="logout-button-area">
          <NavLink to="/login" className="sidebar-link logout-link">
            Log Out
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
