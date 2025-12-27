import { useState, useEffect } from "react";
import { getUsers, deleteUser, changeUserRole } from "../../services/adminService";
import useAuth from "../../hooks/useAuth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user: currentUser } = useAuth();

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
                      onClick={() => handleChangeRole(user.id, isAdmin ? "ADMIN" : "USER")}
                      disabled={isCurrentUser}
                      style={{
                        padding: "6px 12px",
                        marginRight: "5px",
                        background: isAdmin ? "#ffc107" : "#28a745",
                        color: "white",
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
    </div>
  );
}











