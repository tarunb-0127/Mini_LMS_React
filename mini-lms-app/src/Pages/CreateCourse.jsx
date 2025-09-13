// src/Pages/CreateCourse.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { BookOpen, Save } from "lucide-react";

function CreateCourse() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    duration: "",
    visibility: "Public",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const decoded = jwtDecode(token);
    const trainerId = decoded.UserId || decoded.userId || decoded.sub;

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("type", formData.type);
    payload.append("duration", formData.duration);
    payload.append("visibility", formData.visibility);
    payload.append("trainerId", trainerId);

    try {
      const res = await fetch("http://localhost:5254/api/Course/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Course created successfully.");
        navigate(`/trainer/course/${data.id}`);
      } else {
        setMessage(data.message || "Course creation failed.");
      }
    } catch {
      setMessage("Network error. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>
        <BookOpen className="me-2" />
        Create Course
      </h2>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mt-4">
        <div className="mb-3">
          <label>Course Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Course Type</label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Duration (hrs)</label>
          <input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success w-100">
          <Save className="me-2" />
          Create Course
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
