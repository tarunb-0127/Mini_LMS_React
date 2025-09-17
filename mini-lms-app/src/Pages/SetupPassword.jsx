import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SetupPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Validation state
  const [errors, setErrors] = useState({});

  // Fetch user email using userId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5254/api/Users/${userId}`
        );
        setEmail(response.data.email);
      } catch (error) {
        setMessage("Invalid or expired link.");
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const validateForm = () => {
    const errs = {};

    if (!newPassword || newPassword.length < 8) {
      errs.newPassword = "Password must be at least 8 characters.";
    }

    if (confirmPassword !== newPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("token", token);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      const response = await axios.post(
        "http://localhost:5254/api/auth/password-reset/reset",
        formData
      );

      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login"); // Redirect to login after success
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4 text-center">Set Up Your Password</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {!email ? (
        <p>Loading user info...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {errors.newPassword && (
              <div className="invalid-feedback">{errors.newPassword}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Set Password
          </button>
        </form>
      )}
    </div>
  );
}
