import React from "react";

function Sidebar({ setPage }) {
  return (
    <div style={styles.sidebar}>
      <h3 style={{ color: "#fff" }}>Dashboard</h3>

      <button onClick={() => setPage("upload")}>Upload Excel</button>
      <button onClick={() => setPage("add")}>Add Data</button>
      <button onClick={() => setPage("view")}>View Data</button>
      <button onClick={() => setPage("search")}>Search</button>
      <button onClick={() => setPage("download")}>Download</button>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        style={{ marginTop: "20px", background: "red", color: "#fff" }}
      >
        Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#2c3e50",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    gap: "10px",
  },
};

export default Sidebar;