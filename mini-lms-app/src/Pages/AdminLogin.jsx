import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch("http://localhost:5254/api/auth/login/admin", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setStep(2);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);

      const res = await fetch("http://localhost:5254/api/auth/admin/verify-otp", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        localStorage.setItem("token", data.token); // ✅ Store JWT
        navigate("/admin-home");
      } else {
        setMessage(data.message || "OTP verification failed");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMessage("Logged out successfully.");
    navigate("/admin-login");
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Admin Login</h2>

          <form onSubmit={step === 1 ? handleLoginSubmit : handleOtpSubmit}>
            {step === 1 && (
              <>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Send OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Verify OTP
                </button>
              </>
            )}
          </form>

          {message && (
            <div className="alert alert-info mt-3 text-center p-2" role="alert">
              {message}
            </div>
          )}

          {localStorage.getItem("token") && (
            <button className="btn btn-outline-danger mt-3 w-100" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
