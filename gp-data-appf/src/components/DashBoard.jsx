import React, { useState } from "react";
import Sidebar from "./SideBar";
import UploadExcel from "./UploadExcel";
import AddData from "./AddData";
import ViewData from "./ViewData";
import SearchData from "./SearchData";
import DownloadExcel from "./DownloadExcel";
import "./Dashboard.css"; 

function Dashboard() {
  const [page, setPage] = useState("view");

  const renderPage = () => {
    switch (page) {
      case "upload":
        return <UploadExcel />;
      case "add":
        return <AddData />;
      case "search":
        return <SearchData />;
      case "download":
        return <DownloadExcel />;
      default:
        return <ViewData />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar setPage={setPage} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>GP Report Dashboard </h2>
        </div>

        <div className="dashboard-body">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;