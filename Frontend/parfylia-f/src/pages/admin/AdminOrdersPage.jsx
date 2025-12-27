import { useState, useEffect, useCallback } from "react";
import api from "../../utils/axiosConfig";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      if (statusFilter === "ALL") {
        response = await api.get("/admin/orders");
      } else {
        response = await api.get(`/admin/orders/status/${statusFilter}`);
      }
      setOrders(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
      await loadOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Supprimer cette commande ?")) return;

    try {
      await api.delete(`/admin/orders/${orderId}`);
      await loadOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#ffc107";
      case "CONFIRMED": return "#17a2b8";
      case "SHIPPED": return "#007bff";
      case "DELIVERED": return "#28a745";
      case "CANCELLED": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING": return "En attente";
      case "CONFIRMED": return "Confirmée";
      case "SHIPPED": return "Expédiée";
      case "DELIVERED": return "Livrée";
      case "CANCELLED": return "Annulée";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>Gestion des Commandes</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "15px", padding: "10px", background: "#ffe6e6", borderRadius: "5px" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <label>Filtrer par statut:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px 15px", borderRadius: "5px", border: "1px solid #ddd" }}
        >
          <option value="ALL">Tous</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
        <button
          onClick={loadOrders}
          style={{
            padding: "8px 20px",
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
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Client</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Date</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Articles</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Total</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Statut</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center" }}>
                Aucune commande trouvée
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const items = order.items || [];
              const total = items.reduce((sum, item) => {
                return sum + (item.product?.price || 0) * item.quantity;
              }, 0);

              return (
                <tr key={order.id}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>#{order.id}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {order.user?.email || "-"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {formatDate(order.createdAt)}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {items.length} article(s)
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {total.toFixed(2)} DH
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "5px",
                        border: "none",
                        background: getStatusColor(order.status),
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => handleDelete(order.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer"
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
