import React from "react";
import API from "../Api";
import "./DownloadExcel.css"; 
function DownloadExcel() {
  const handleDownload = async () => {
    try {
      const res = await API.get("/data/download", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "gp_reports.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Download Failed");
    }
  };

  return (
    <div className="download-container">
      <h3>Download Excel Report</h3>

      <p className="download-text">
        Click the button below to download the latest GP report in Excel format.
      </p>

      <button className="download-btn" onClick={handleDownload}>
        ⬇ Download Excel
      </button>
    </div>
  );
}

export default DownloadExcel;