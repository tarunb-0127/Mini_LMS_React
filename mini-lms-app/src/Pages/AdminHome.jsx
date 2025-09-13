import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h1 className="text-center text-3xl fw-bold text-dark">
          Admin Dashboard
        </h1>
        <p className="text-center text-muted">
          Manage your LMS resources easily 🚀
        </p>

        <div className="row mt-5">
          {/* Manage Users */}
          <div className="col-md-4">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Manage Users</h5>
                <p className="card-text text-muted">
                  View, activate, or deactivate users.
                </p>
                <Link to="/admin/users" className="btn btn-primary">Go</Link>
              </div>
            </div>
          </div>

          {/* Manage Courses */}
          <div className="col-md-4">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Manage Courses</h5>
                <p className="card-text text-muted">
                  Add, update, or remove courses.
                </p>
                <Link to="/admin/courses" className="btn btn-success">Go</Link>
              </div>
            </div>
          </div>

          {/* Manage Trainers */}
          <div className="col-md-4">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Manage Trainers</h5>
                <p className="card-text text-muted">
                  Assign or manage trainers for courses.
                </p>
                <Link to="/admin/trainers" className="btn btn-warning">Go</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center mt-5">
          <button className="btn btn-outline-danger px-4" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
