import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../Api";
import "./Login.css";

function Login({ setToken }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setError(""); // clear error while typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.email || !form.password) {
      return setError("Please enter email and password");
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", form);

      const token = res.data.token;

      // ✅ Save token
      localStorage.setItem("token", token);
      setToken(token);

      // ✅ Redirect
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);

      // ✅ Backend error
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      }
      // ✅ Server not reachable
      else if (err.request) {
        setError("Server not responding ❌");
      }
      // ✅ Other errors
      else {
        setError("Something went wrong ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        {/* Error Message */}
        {error && <div className="error-box">{error}</div>}

        <input
          name="email"
          type="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;