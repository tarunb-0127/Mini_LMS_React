// src/pages/LearnerCourseDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, User, Clock, FileText, ArrowLeft, Lock } from "lucide-react";

export default function LearnerCourseDetails() {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Get course details
        const res = await axios.get(`http://localhost:5254/api/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);

        // Check enrollment separately
        const enrollRes = await axios.get(
          `http://localhost:5254/api/Enrollment/my-courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const isEnrolled = enrollRes.data.some((c) => c.id === parseInt(id));
        setEnrolled(isEnrolled);

        // Load modules only if enrolled
        if (isEnrolled) {
          const modulesRes = await axios.get(
            `http://localhost:5254/api/Module/course/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setModules(modulesRes.data);
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

      // Fetch modules after enrolling
      const modulesRes = await axios.get(
        `http://localhost:5254/api/Module/course/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(modulesRes.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error enrolling in course.");
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!course) return <div className="container mt-5">Course not found.</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
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
          <p className="mb-1">
            <User size={14} className="me-1" /> Trainer: {course.trainer?.username}
          </p>
          <p className="mb-1">
            <Clock size={14} className="me-1" /> Duration: {course.duration} hrs
          </p>
          <p className="mb-2">
            <FileText size={14} className="me-1" /> Type: {course.type}
          </p>
          <p className="text-muted">{course.description}</p>

          {!enrolled ? (
            <button className="btn btn-primary btn-sm" onClick={handleEnroll}>
              Enroll in Course
            </button>
          ) : (
            <span className="badge bg-success">Enrolled</span>
          )}
        </div>
      </div>

      {/* Modules Accordion */}
      <h5 className="mb-3">Modules</h5>
      {!enrolled ? (
        <div className="alert alert-info d-flex align-items-center">
          <Lock size={16} className="me-2" />
          Enroll in this course to view modules.
        </div>
      ) : modules.length === 0 ? (
        <div className="alert alert-warning">No modules available yet.</div>
      ) : (
        <div className="accordion" id="modulesAccordion">
          {modules.map((m, index) => (
            <div className="accordion-item" key={m.id}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                >
                  {m.name}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#modulesAccordion"
              >
                <div className="accordion-body">
                  <p>{m.description || "No description provided."}</p>
                  {m.filePath && (
                    <a
                      href={`http://localhost:5254${m.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Open File
                    </a>
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
