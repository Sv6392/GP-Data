// import React, { useState, useEffect } from "react";
// import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Dashboard from "./components/DashBoard";
// import Login from "./components/Login";
// import Register from "./components/RegiSter";

// function App() {
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     }
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "100px" }}>
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <Routes>

//         {/* Default Route */}
//         <Route
//           path="/"
//           element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
//         />

//         {/* Auth Routes */}
//         <Route path="/login" element={<Login setToken={setToken} />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected Route */}
//         <Route
//           path="/dashboard"
//           element={token ? <Dashboard /> : <Navigate to="/login" />}
//         />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/DashBoard";
import Login from "./components/Login";
import Register from "./components/RegiSter";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;