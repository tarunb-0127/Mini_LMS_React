// src/Pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Trainer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

      const res = await axios.post(
        "http://localhost:5254/api/auth/login/user",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      navigate(role === "Trainer" ? "/trainer/home" : "/learner/home");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <User size={48} className="text-primary" />
          <h2 className="mt-2">Welcome Back</h2>
          <p className="text-muted">Please login to continue</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span className="input-group-text bg-white">
              <Mail size={16} />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text bg-white">
              <Lock size={16} />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label d-block">Role</label>
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn ${
                  role === "Trainer"
                    ? "btn-outline-primary active"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setRole("Trainer")}
              >
                <UserCheck size={16} className="me-1" />
                Trainer
              </button>
              <button
                type="button"
                className={`btn ${
                  role === "Learner"
                    ? "btn-outline-primary active"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setRole("Learner")}
              >
                <UserPlus size={16} className="me-1" />
                Learner
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
            )}
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
