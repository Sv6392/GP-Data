import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../Api";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered Successfully ");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed ");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>

        <input 
          name="name" 
          placeholder="Full Name" 
          onChange={handleChange} 
        />

        <input 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
        />

        <input 
          name="contact" 
          placeholder="Contact Number" 
          onChange={handleChange} 
        />

        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          onChange={handleChange} 
        />

        <button onClick={handleRegister}>Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;