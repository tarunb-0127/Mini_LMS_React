import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Eye,
  Shield,
  AlertCircle,
  Inbox,
} from "lucide-react";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [takedownCount, setTakedownCount] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", {
        state: { alert: "Please login to view course activity" },
      });
      return;
    }

    // Fetch all courses
    fetch("http://localhost:5254/api/course/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setCourses(data);
      })
      .catch(() => {
        navigate("/admin-login", {
          state: { alert: "Session expired. Please login again." },
        });
      });

    // Fetch takedown request count
    fetch("http://localhost:5254/api/takedown/count", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setTakedownCount(data.count);
        }
      })
      .catch(() => {
        setMessage("Failed to load takedown request count.");
      });
  }, [navigate, token]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        <BookOpen className="me-2" /> Course Overview
      </h2>

      {message && (
        <div className="alert alert-warning text-center">{message}</div>
      )}

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5>
              <Inbox className="me-2 text-primary" />
              Total Courses
            </h5>
            <h3 className="fw-bold">{courses.length}</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5>
              <AlertCircle className="me-2 text-danger" />
              Takedown Requests
            </h5>
            <h3 className="fw-bold text-danger">{takedownCount}</h3>
          </div>
        </div>
      </div>

      <h5 className="mb-3">
        <Eye className="me-2" /> Course List
      </h5>
      {courses.length === 0 ? (
        <p className="text-muted">No courses available.</p>
      ) : (
        <div className="list-group">
          {courses.map((course) => (
            <div
              key={course.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h6 className="mb-1">
                  <Shield className="me-2 text-primary" />
                  {course.name}
                </h6>
                <small className="text-muted">
                  <Clock className="me-1" />
                  {course.duration} hrs • {course.type} •{" "}
                  <span className="badge bg-secondary">{course.visibility}</span>
                </small>
              </div>
              {/* Optional: show takedown status if available */}
              {course.isTakedownRequested && (
                <span className="badge bg-danger">Takedown Requested</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageCourses;
