import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  UserCheck,
  UserMinus,
  AlertCircle,
} from "lucide-react";
import Navbar from "../Components/Navbar";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", {
        state: { alert: "Please login to view dashboard" },
      });
      return;
    }

    fetch("http://localhost:5254/api/auth/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/admin-login", {
            state: { alert: "Please login to view dashboard" },
          });
          return;
        }
        const data = await res.json();
        setStats(data);
      })
      .catch(() => setError("Failed to load dashboard data."));
  }, [navigate, token]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">
          <Users className="me-2" /> Admin Overview
        </h2>

        <div className="row gy-4">
          <StatCard
            icon={<BookOpen size={32} className="text-primary" />}
            label="Courses"
            value={stats.totalCourses}
          />
          <StatCard
            icon={<Users size={32} className="text-success" />}
            label="Total Users"
            value={stats.totalUsers}
          />
          <StatCard
            icon={<UserCheck size={32} className="text-info" />}
            label="Active Users"
            value={stats.activeUsers}
          />
          <StatCard
            icon={<UserCheck size={32} className="text-warning" />}
            label="Trainers"
            value={stats.totalTrainers}
          />
          <StatCard
            icon={<UserMinus size={32} className="text-secondary" />}
            label="Learners"
            value={stats.totalLearners}
          />
          <StatCard
            icon={<AlertCircle size={32} className="text-danger" />}
            label="Takedown Requests"
            value={stats.takedownRequests}
          />
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm text-center p-3 h-100">
        <div className="mb-2">{icon}</div>
        <h5 className="card-title">{label}</h5>
        <h3 className="fw-bold">{value}</h3>
      </div>
    </div>
  );
}

export default AdminDashboard;
