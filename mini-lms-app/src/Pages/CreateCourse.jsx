import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { BookOpen, Tag, Clock, Eye, PlusCircle } from "lucide-react";

export default function CreateCourse() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token")?.trim();

  const [course, setCourse] = useState({
    name: "",
    type: "",
    duration: "",
    visibility: "Public",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check token on mount
  useEffect(() => {
    if (!token) {
      navigate("/trainer-login", { state: { alert: "Please login first." } });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded.email || decoded.role !== "Trainer") {
        throw new Error("Unauthorized");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.clear();
      navigate("/trainer-login", { state: { alert: "Session invalid. Please login again." } });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5254/api/Course/create",
        course,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Course "${res.data.name}" created successfully!`);
      navigate("/trainer/my-courses");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create course. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="mb-4 text-center text-primary d-flex align-items-center justify-content-center">
          <BookOpen size={28} className="me-2" /> Create New Course
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span className="input-group-text bg-white"><BookOpen size={20} /></span>
            <input
              type="text"
              name="name"
              value={course.name}
              onChange={handleChange}
              className="form-control form-control-lg"
              placeholder="Course Name"
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text bg-white"><Tag size={20} /></span>
            <input
              type="text"
              name="type"
              value={course.type}
              onChange={handleChange}
              className="form-control form-control-lg"
              placeholder="Course Type"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3 input-group">
              <span className="input-group-text bg-white"><Clock size={20} /></span>
              <input
                type="number"
                name="duration"
                value={course.duration}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Duration (hrs)"
                required
              />
            </div>

            <div className="col-md-6 mb-3 input-group">
              <span className="input-group-text bg-white"><Eye size={20} /></span>
              <select
                name="visibility"
                value={course.visibility}
                onChange={handleChange}
                className="form-select form-select-lg"
              >
                <option value="Public">Public</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mt-3 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            <PlusCircle size={20} className="me-2" />
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
