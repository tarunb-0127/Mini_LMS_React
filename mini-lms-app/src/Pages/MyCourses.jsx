import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  BookOpen,
  Pencil,
  AlertTriangle,
  Clock,
  Shield,
  Save,
  X,
  Layers,
} from "lucide-react";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [trainerId, setTrainerId] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    duration: "",
    visibility: "Public",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        state: { alert: "Please login to view your courses" },
      });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setTrainerId(decoded.UserId || decoded.userId || decoded.sub);
      setUsername(decoded.username || "Trainer");
    } catch {
      localStorage.clear();
      navigate("/login", {
        state: { alert: "Session invalid. Please login again." },
      });
      return;
    }

    fetchCourses();
  }, [navigate, token]);

  const fetchCourses = () => {
    fetch("http://localhost:5254/api/Course/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        const mine = data.filter(
          (c) => c.trainerId?.toString() === trainerId?.toString()
        );
        setCourses(mine);
      })
      .catch(() => {
        setMessage("Failed to load courses.");
      });
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name || "",
      type: course.type || "",
      duration: course.duration || "",
      visibility: course.visibility || "Public",
    });
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setFormData({
      name: "",
      type: "",
      duration: "",
      visibility: "Public",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("type", formData.type);
    updateData.append("duration", formData.duration);
    updateData.append("visibility", formData.visibility);

    try {
      const res = await fetch(
        `http://localhost:5254/api/Course/edit/${editingCourse.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: updateData,
        }
      );

      const result = await res.json();
      if (res.ok) {
        setMessage("Course updated successfully.");
        handleCancelEdit();
        fetchCourses();
      } else {
        setMessage(result.message || "Update failed.");
      }
    } catch {
      setMessage("Network error updating course.");
    }
  };

  const handleTakedown = async (courseId) => {
    const reason = prompt("Enter reason for takedown request:");
    if (!reason) return;

    const params = new URLSearchParams();
    params.append("courseId", courseId);
    params.append("reason", reason);

    try {
      const res = await fetch(
        "http://localhost:5254/api/course/request-takedown",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || "Takedown request failed.");
      }
    } catch {
      setMessage("Network error sending takedown request.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        <BookOpen className="me-2" />
        My Courses
      </h2>

      {message && (
        <div className="alert alert-info text-center">{message}</div>
      )}

      {courses.length === 0 ? (
        <p className="text-muted">You haven’t created any courses yet.</p>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {editingCourse?.id === course.id ? (
                    <form onSubmit={handleUpdate}>
                      <div className="mb-2">
                        <input
                          className="form-control"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Course Name"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          className="form-control"
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
                          placeholder="Course Type"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          className="form-control"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          placeholder="Duration (hrs)"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          value={formData.visibility}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              visibility: e.target.value,
                            })
                          }
                        >
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                        </select>
                      </div>
                      <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-success btn-sm">
                          <Save size={16} className="me-1" />
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="me-1" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h5 className="card-title">
                        <Shield className="me-2 text-primary" />
                        {course.name}
                      </h5>
                      <p className="card-text text-muted">
                        <Clock className="me-1" />
                        {course.duration} hrs • {course.type}
                        <br />
                        <span className="badge bg-secondary mt-2">
                          {course.visibility}
                        </span>
                      </p>
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(course)}
                        >
                          <Pencil size={16} className="me-1" />
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleTakedown(course.id)}
                        >
                          <AlertTriangle size={16} className="me-1" />
                          Request Takedown
                        </button>
                      </div>
                      <Link
                        to={`/trainer/course/${course.id}`}
                        className="btn btn-sm btn-outline-secondary mt-2 w-100"
                      >
                        <Layers size={16} className="me-1" />
                        View Modules
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
