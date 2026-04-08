import React, { useState } from "react";
import Sidebar from "./SideBar";
import Home from "./Home";              // ✅ NEW
import UploadExcel from "./UploadExcel";
import AddData from "./AddData";
import ViewData from "./ViewData";
import SearchData from "./SearchData";
import DownloadExcel from "./DownloadExcel";
import "./Dashboard.css";

function Dashboard() {
  // ✅ Default page = home
  const [page, setPage] = useState("home");

  // 🔥 Dynamic page rendering
  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home />;

      case "upload":
        return <UploadExcel />;

      case "add":
        return <AddData />;

      case "search":
        return <SearchData />;

      case "download":
        return <DownloadExcel />;

      case "view":
      default:
        return <ViewData />;
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <Sidebar setPage={setPage} />

      {/* Main Content */}
      <div className="dashboard-content">

        {/* Header */}
        <div className="dashboard-header">
          <h2>
            {page === "home" && "🏠 Home"}
            {page === "upload" && "📤 Upload Excel"}
            {page === "add" && "➕ Add Data"}
            {page === "view" && "👁️ View Data"}
            {page === "search" && "🔍 Search Data"}
            {page === "download" && "📥 Download Data"}
          </h2>
        </div>

        {/* Page Content */}
        <div className="dashboard-body">
          {renderPage()}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;