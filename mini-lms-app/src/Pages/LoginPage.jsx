// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Trainer"); // default
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
 
      const res = await axios.post("http://localhost:5254/api/login/login", formData);
 
      // ✅ Save JWT token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
 
      // Redirect by role
      if (res.data.role === "Trainer") {
        navigate("/trainer/home");
      } else {
        navigate("/learner/home");
      }
    } catch (err) {
      setError("Login failed. Please check credentials.");
    }
  };
 
  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control"
                 value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control"
                 value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-select"
                  value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Trainer">Trainer</option>
            <option value="Learner">Learner</option>
          </select>
        </div>
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};
 
export default Login;
 