import { useState, useEffect } from "react";
import { getUsers, deleteUser, changeUserRole, updateUser } from "../../services/adminService";
import useAuth from "../../hooks/useAuth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user: currentUser } = useAuth();

  // État pour le modal de modification
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", username: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data || response);
      setError("");
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await deleteUser(id);
      loadUsers(); // Recharger la liste
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleChangeRole = async (id, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    if (!window.confirm(`Changer le rôle de cet utilisateur en ${newRole} ?`)) {
      return;
    }

    try {
      await changeUserRole(id, newRole);
      loadUsers(); // Recharger la liste
    } catch (err) {
      console.error("Error changing role:", err);
      alert("Erreur lors du changement de rôle");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      username: user.username || ""
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, editForm);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Erreur lors de la modification: " + (err.response?.data?.message || err.message));
    }
  };

  const closeModal = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "", username: "" });
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Gestion des Utilisateurs</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "15px", padding: "10px", background: "#ffe6e6", borderRadius: "5px" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={loadUsers}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Actualiser
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Nom</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Rôles</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Permissions</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: "20px", textAlign: "center" }}>
                Aucun utilisateur trouvé
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const roles = user.roles || [];
              const permissions = user.permissions || [];
              const isCurrentUser = currentUser && (currentUser.sub === user.email || currentUser.email === user.email);
              const isAdmin = roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");

              return (
                <tr key={user.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{user.id}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{user.email}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{user.name || "-"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {Array.isArray(roles) ? roles.join(", ") : roles || "USER"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {Array.isArray(permissions) ? permissions.join(", ") : permissions || "READ"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{
                        padding: "6px 12px",
                        marginRight: "5px",
                        background: "#17a2b8",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer"
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleChangeRole(user.id, isAdmin ? "ADMIN" : "USER")}
                      disabled={isCurrentUser}
                      style={{
                        padding: "6px 12px",
                        marginRight: "5px",
                        background: isAdmin ? "#ffc107" : "#28a745",
                        color: isAdmin ? "#000" : "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: isCurrentUser ? "not-allowed" : "pointer",
                        opacity: isCurrentUser ? 0.5 : 1
                      }}
                    >
                      {isAdmin ? "Retirer Admin" : "Donner Admin"}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isCurrentUser}
                      style={{
                        padding: "6px 12px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: isCurrentUser ? "not-allowed" : "pointer",
                        opacity: isCurrentUser ? 0.5 : 1
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Modal de modification */}
      {editingUser && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Modifier l'utilisateur</h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Nom
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "10px 20px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



