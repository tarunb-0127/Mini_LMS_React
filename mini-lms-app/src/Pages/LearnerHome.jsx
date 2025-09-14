import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Navbar from "../Components/Navbar";
import LogoutButton from "../Components/LogoutButton";
import { BookOpen, Bell, Calendar, List, Quote, Search } from "lucide-react";

export default function LearnerHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [learner, setLearner] = useState({ username: "", email: "", id: null });
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    notifications: 0,
    upcomingSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [recentCourses, setRecentCourses] = useState([]);
  const [browseCourses, setBrowseCourses] = useState([]);

  useEffect(() => {
    const fetchLearnerData = async () => {
      if (!token) {
        navigate("/login", { state: { alert: "Please login to access dashboard" } });
        return;
      }

      try {
        // Decode token to get learner info
        const decoded = jwtDecode(token);
        setLearner({
          username: decoded.username || "",
          email: decoded.email || "",
          id: decoded.userId || decoded.sub,
        });

        // Fetch all courses
        const coursesRes = await axios.get("http://localhost:5254/api/course/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter courses enrolled by learner
        const enrolled = coursesRes.data.filter(
          (c) =>
            c.enrolledLearners?.includes(decoded.userId) || c.Visibility === "Public"
        );
        setStats((prev) => ({ ...prev, enrolledCourses: enrolled.length }));

        // Recent courses: last 3 enrolled
        const recent = enrolled.slice(0, 3);
        setRecentCourses(recent);

        // Browse courses: all available for browsing
        setBrowseCourses(coursesRes.data);

        // Notifications (example)
        const notifRes = await axios.get("http://localhost:5254/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats((prev) => ({ ...prev, notifications: notifRes.data.length }));

        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.clear();
        navigate("/login", { state: { alert: "Session expired. Please login again." } });
      }
    };

    fetchLearnerData();
  }, [token, navigate]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const filteredCourses = browseCourses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="container mt-5 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h3>
              Welcome, <span className="text-primary">{learner.username}</span>!
            </h3>
            <p className="text-muted mb-0">
              Email: <strong>{learner.email}</strong>
              <br />
              Today is {today}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="alert alert-secondary d-flex align-items-center mb-4">
          <Quote className="me-2" />
          <span>“Learning is a treasure that will follow its owner everywhere.”</span>
        </div>

        {/* Dashboard Cards */}
        <div className="row g-3 mb-5">
          <DashboardCard
            icon={<BookOpen size={32} className="text-primary" />}
            label="Enrolled Courses"
            value={stats.enrolledCourses}
          />
          <DashboardCard
            icon={<Bell size={32} className="text-info" />}
            label="Notifications"
            value={stats.notifications}
          />
          <DashboardCard
            icon={<Calendar size={32} className="text-success" />}
            label="Upcoming Sessions"
            value={stats.upcomingSessions}
          />
        </div>

        {/* Search Box */}
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Recent Courses */}
        <div className="mb-5">
          <h5 className="mb-3">Recent Courses</h5>
          <div className="row g-3">
            {recentCourses.length ? (
              recentCourses.map((c) => (
                <div key={c.id} className="col-md-4">
                  <div className="card shadow-sm p-3 h-100">
                    <h6>{c.name}</h6>
                    <p className="mb-0">Trainer: {c.trainer?.username}</p>
                    <p className="mb-0">Duration: {c.duration} hrs</p>
                    <Link
                      to={`/learner/course/${c.id}`}
                      className="btn btn-sm btn-primary mt-2"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent courses found.</p>
            )}
          </div>
        </div>

        {/* Browse Courses */}
        <div className="mb-5">
          <h5 className="mb-3">Browse Courses</h5>
          <div className="row g-3">
            {filteredCourses.length ? (
              filteredCourses.map((c) => (
                <div key={c.id} className="col-md-3">
                  <div className="card shadow-sm p-3 h-100">
                    <h6>{c.name}</h6>
                    <p className="mb-0">Trainer: {c.trainer?.username}</p>
                    <p className="mb-0">Duration: {c.duration} hrs</p>
                    <Link
                      to={`/learner/course/${c.id}`}
                      className="btn btn-sm btn-outline-primary mt-2"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardCard({ icon, label, value }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className="card text-center shadow-sm p-3 h-100">
        <div className="mb-2">{icon}</div>
        <h6 className="card-title">{label}</h6>
        <h4 className="fw-bold">{value}</h4>
      </div>
    </div>
  );
}
