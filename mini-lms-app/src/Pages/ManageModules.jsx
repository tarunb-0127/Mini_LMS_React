import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, ArrowLeft, PlusCircle, Trash2, Edit } from "lucide-react";

const ManageModules = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", file: null });
  const [editId, setEditId] = useState(null);
  const [courseName, setCourseName] = useState(""); // ✅ new state for course name

  // Fetch course details
  useEffect(() => {
    if (!courseId) return;
    axios
      .get(`http://localhost:5254/api/Course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCourseName(res.data.name)) // assuming API returns { id, name, ... }
      .catch((err) => console.error("Failed to fetch course:", err));
  }, [courseId]);

  // Fetch modules
  useEffect(() => {
    if (!courseId) return;
    fetchModules();
  }, [courseId]);

  const fetchModules = () => {
    setLoading(true);
    axios
      .get(`http://localhost:5254/api/Module/course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setModules(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Add or Update module
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Title", form.title);
    formData.append("Content", form.content);
    formData.append("File", form.file);
    if (!editId) formData.append("CourseId", courseId);

    try {
      if (editId) {
        await axios.put(`http://localhost:5254/api/Module/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(
          `http://localhost:5254/api/Module/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      setForm({ title: "", content: "", file: null });
      setEditId(null);
      fetchModules();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete module
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await axios.delete(`http://localhost:5254/api/Module/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchModules();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit module
  const handleEdit = (m) => {
    setEditId(m.id);
    setForm({ title: m.name, content: m.description || "", file: null });
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <BookOpen size={24} className="me-2" />
          Manage Modules for {courseName || `Course ${courseId}`}
        </h2>
        <Link to={`/trainer/my-courses`} className="btn btn-outline-secondary">
          <ArrowLeft size={16} className="me-1" />
          Back to Courses
        </Link>
      </div>

      {/* Form */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">
            {editId ? "Edit Module" : "Add New Module"}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="form-control"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Upload File</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} className="me-1" />
              {editId ? "Update Module" : "Add Module"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditId(null);
                  setForm({ title: "", content: "", file: null });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Module List */}
      {loading ? (
        <p>Loading modules...</p>
      ) : modules.length === 0 ? (
        <div className="alert alert-info">No modules found for this course.</div>
      ) : (
        <div className="row">
          {modules.map((m) => (
            <div key={m.id} className="col-md-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{m.name}</h5>
                  <p className="card-text text-muted">
                    {m.description || "No description provided."}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(m)}
                    >
                      <Edit size={14} className="me-1" />
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(m.id)}
                    >
                      <Trash2 size={14} className="me-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageModules;
