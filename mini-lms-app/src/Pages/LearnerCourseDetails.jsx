// src/pages/LearnerCourseDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, User, Clock, FileText, ArrowLeft, Lock } from "lucide-react";

export default function LearnerCourseDetails() {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5254/api/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);

        const enrollRes = await axios.get(
          `http://localhost:5254/api/Enrollment/my-courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const isEnrolled = enrollRes.data.some((c) => c.id === parseInt(id));
        setEnrolled(isEnrolled);

        if (isEnrolled) {
          const modulesRes = await axios.get(
            `http://localhost:5254/api/Module/course/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setModules(modulesRes.data);
          if (modulesRes.data.length > 0) setSelectedModule(modulesRes.data[0]); // default selection
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, token]);

  const handleEnroll = async () => {
    try {
      await axios.post(
        `http://localhost:5254/api/Enrollment/enroll/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);

      const modulesRes = await axios.get(
        `http://localhost:5254/api/Module/course/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(modulesRes.data);
      if (modulesRes.data.length > 0) setSelectedModule(modulesRes.data[0]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error enrolling in course.");
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!course) return <div className="container mt-5">Course not found.</div>;

  const renderFile = (filePath) => {
    if (!filePath) return null;
    const fileUrl = `http://localhost:5254/uploads/${encodeURIComponent(filePath)}`;
    const ext = filePath.split(".").pop().toLowerCase();

    if (["mp4", "webm", "ogg"].includes(ext)) {
      return (
        <video
          src={fileUrl}
          controls
          className="w-100 mb-2"
          style={{ maxHeight: "400px" }}
        />
      );
    } else if (ext === "pdf") {
      return (
        <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
          Open PDF
        </a>
      );
    } else {
      return (
        <a href={fileUrl} download className="btn btn-sm btn-outline-secondary">
          Download File
        </a>
      );
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          <BookOpen size={22} className="me-2" />
          {course.name}
        </h3>
        <Link to="/learner/home" className="btn btn-outline-secondary btn-sm">
          <ArrowLeft size={14} className="me-1" />
          Back
        </Link>
      </div>

      {/* Course Info */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <p className="mb-1"><User size={14} className="me-1" /> Trainer: {course.trainer?.username}</p>
          <p className="mb-1"><Clock size={14} className="me-1" /> Duration: {course.duration} hrs</p>
          <p className="mb-2"><FileText size={14} className="me-1" /> Type: {course.type}</p>
          <p className="text-muted">{course.description}</p>

          {!enrolled ? (
            <button className="btn btn-primary btn-sm" onClick={handleEnroll}>Enroll in Course</button>
          ) : (
            <span className="badge bg-success">Enrolled</span>
          )}
        </div>
      </div>

      {!enrolled ? (
        <div className="alert alert-info d-flex align-items-center">
          <Lock size={16} className="me-2" />
          Enroll in this course to view modules.
        </div>
      ) : modules.length === 0 ? (
        <div className="alert alert-warning">No modules available yet.</div>
      ) : (
        <div className="row">
          {/* Sidebar: Modules List */}
          <div className="col-md-3 mb-3">
            <ul className="list-group">
              {modules.map((m) => (
                <li
                  key={m.id}
                  className={`list-group-item ${selectedModule?.id === m.id ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedModule(m)}
                >
                  {m.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Content: Module Details */}
          <div className="col-md-9">
            {selectedModule && (
              <div className="card shadow-sm mb-3">
                <div className="card-body">
                  <h5 className="card-title">{selectedModule.name}</h5>
                  {renderFile(selectedModule.filePath)}
                  <p className="mt-2 text-muted">{selectedModule.description || "No description provided."}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
