import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../Api";
import "./Login.css"; 

function Login({ setToken }) {   // ✅ receive setToken
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      const token = res.data.token;

      // ✅ Save in localStorage
      localStorage.setItem("token", token);

      // 🔥 MOST IMPORTANT FIX
      setToken(token);

      // ✅ Navigate after state update
      navigate("/dashboard");

    } catch (err) {
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <input 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
        />

        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          onChange={handleChange} 
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;