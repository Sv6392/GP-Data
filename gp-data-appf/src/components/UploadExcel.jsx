import React, { useState } from "react";
import API from "../Api";
import "./UploadExcel.css";

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file ❌");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await API.post("/data/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data || "Upload successful ✅");
      setFile(null);

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err.response?.data || "Upload Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Excel File</h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="upload-input"
      />

      {file && (
        <p className="file-name">
          Selected: <strong>{file.name}</strong>
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="upload-btn"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default UploadExcel;