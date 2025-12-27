export default function OrderCard({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ffc107";
      case "CONFIRMED":
        return "#17a2b8";
      case "SHIPPED":
        return "#007bff";
      case "DELIVERED":
        return "#28a745";
      case "CANCELLED":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "CONFIRMED":
        return "Confirmée";
      case "SHIPPED":
        return "Expédiée";
      case "DELIVERED":
        return "Livrée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const items = order.items || [];
  const total = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "15px",
        background: "#fff"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Commande #{order.id}</h3>
          <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
            {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          style={{
            padding: "6px 12px",
            borderRadius: "20px",
            background: getStatusColor(order.status),
            color: "white",
            fontSize: "14px",
            fontWeight: "bold"
          }}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {items.length > 0 && (
        <div style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: index < items.length - 1 ? "1px solid #f5f5f5" : "none"
              }}
            >
              <span>
                {item.product?.name || "Produit"} x {item.quantity}
              </span>
              <span style={{ fontWeight: "bold" }}>
                {((item.product?.price || 0) * item.quantity).toFixed(2)} DH
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          borderTop: "2px solid #ddd",
          marginTop: "15px",
          paddingTop: "15px",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <h4 style={{ margin: 0 }}>Total: {total.toFixed(2)} DH</h4>
      </div>
    </div>
  );
}
