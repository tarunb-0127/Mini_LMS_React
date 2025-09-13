import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Learner");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5254/api/Users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const generateTempPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const tempPassword = generateTempPassword();

      const formData = new FormData();
      formData.append("email", email);
      formData.append("role", role);
      formData.append("password", tempPassword);

      await axios.post("http://localhost:5254/api/auth/register", formData);

      setMessage(
        `✅ User added successfully!`
      );
      setEmail("");
      setRole("Learner");
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Error adding user.");
    }
  };

  const handleSendInvite = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5254/api/auth/password-reset/request",
        new URLSearchParams({ userId })
      );
      setMessage("📩 Invite/setup link sent successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Error sending invite.");
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5254/api/Users/${id}/toggle`
      );
      setMessage(response.data.message);
      fetchUsers();
    } catch (error) {
      setMessage("❌ Error updating user status.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5254/api/Users/${id}`);
      setMessage("🗑️ User deleted successfully.");
      fetchUsers();
    } catch (error) {
      setMessage("❌ Error deleting user.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Manage Users</h2>

              {/* Add User Form */}
              <form onSubmit={handleAddUser} className="row g-3 mb-4">
                <div className="col-md-5">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter user email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Learner">Learner</option>
                    <option value="Trainer">Trainer</option>
                  </select>
                </div>
                <div className="col-md-3 d-grid">
                  <button type="submit" className="btn btn-primary">
                    Add User
                  </button>
                </div>
              </form>

              {message && (
                <div className="alert alert-info text-center">{message}</div>
              )}

              {/* Users Table */}
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.email}</td>
                          <td>{u.role}</td>
                          <td>
                            <span
                              className={`badge ${
                                u.is_active ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {u.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleSendInvite(u.id)}
                              >
                                Invite
                              </button>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => toggleUserStatus(u.id)}
                              >
                                Toggle
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteUser(u.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
