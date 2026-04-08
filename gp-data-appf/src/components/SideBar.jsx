import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar({ setPage }) {
  const [active, setActive] = useState("home"); // ✅ default home
  const [openProfile, setOpenProfile] = useState(false);

  const handleClick = (page) => {
    setActive(page);
    setPage(page);
    setOpenProfile(false); // close dropdown on navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="sidebar">

      {/* Header */}
      <div className="sidebar-header">
        <div className="logo"><h3>GP</h3></div>
        <h3>Dashboard</h3>
      </div>

      {/* Menu */}
      <div className="menu">

        {/* ✅ Home */}
        <div
          className={`menu-item ${active === "home" ? "active" : ""}`}
          onClick={() => handleClick("home")}
        >
          <i className="fas fa-home"></i>
          Home
        </div>

        <div
          className={`menu-item ${active === "upload" ? "active" : ""}`}
          onClick={() => handleClick("upload")}
        >
          <i className="fas fa-upload"></i>
          Upload Excel
        </div>

        <div
          className={`menu-item ${active === "add" ? "active" : ""}`}
          onClick={() => handleClick("add")}
        >
          <i className="fas fa-plus"></i>
          Add Data
        </div>

        <div
          className={`menu-item ${active === "view" ? "active" : ""}`}
          onClick={() => handleClick("view")}
        >
          <i className="fas fa-eye"></i>
          View Data
        </div>

        <div
          className={`menu-item ${active === "search" ? "active" : ""}`}
          onClick={() => handleClick("search")}
        >
          <i className="fas fa-search"></i>
          Search
        </div>

        <div
          className={`menu-item ${active === "download" ? "active" : ""}`}
          onClick={() => handleClick("download")}
        >
          <i className="fas fa-download"></i>
          Download
        </div>
      </div>

      {/* ✅ Profile Section (Bottom Fixed) */}
      <div className="profile-section">
        
        <div
          className="profile-box"
          onClick={() => setOpenProfile(!openProfile)}
        >
          <div className="profile-avatar">S</div>

          <div className="profile-info">
            <span className="profile-name">Suraj</span>
            <span className="profile-role">Admin</span>
          </div>

          <i
            className={`fas ${
              openProfile ? "fa-chevron-down" : "fa-chevron-up"
            }`}
          ></i>
        </div>

        {/* Dropdown */}
        {openProfile && (
          <div className="profile-dropdown">
            <div className="dropdown-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default Sidebar;