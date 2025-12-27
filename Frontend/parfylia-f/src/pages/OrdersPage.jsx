import { useState, useEffect } from "react";
import { getOrders, cancelOrder } from "../services/orderService";
import { Link } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      return;
    }

    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      await loadOrders();
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Erreur lors de l'annulation de la commande");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return { bg: "#FEF3C7", color: "#92400E" };
      case "CONFIRMED": return { bg: "#DBEAFE", color: "#1E40AF" };
      case "PROCESSING": return { bg: "#E0E7FF", color: "#3730A3" };
      case "SHIPPED": return { bg: "#D1FAE5", color: "#065F46" };
      case "DELIVERED": return { bg: "#059669", color: "#FFFFFF" };
      case "CANCELLED": return { bg: "#FEE2E2", color: "#991B1B" };
      default: return { bg: "#F3F4F6", color: "#4B5563" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING": return "En attente";
      case "CONFIRMED": return "Confirmée";
      case "PROCESSING": return "En préparation";
      case "SHIPPED": return "Expédiée";
      case "DELIVERED": return "Livrée";
      case "CANCELLED": return "Annulée";
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case "CONFIRMED":
        return <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case "PROCESSING":
        return <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />;
      case "SHIPPED":
        return <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />;
      case "DELIVERED":
        return <path d="M5 13l4 4L19 7" />;
      case "CANCELLED":
        return <path d="M6 18L18 6M6 6l12 12" />;
      default:
        return <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement de vos commandes...</p>
        </div>

        <style jsx>{`
          .page-container {
            min-height: 100vh;
            padding-top: 120px;
            padding-bottom: 80px;
          }

          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 20px;
          }

          .spinner {
            width: 48px;
            height: 48px;
            border: 3px solid #f0f0f0;
            border-top-color: #D4AF37;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .loading-state p {
            color: #6B7280;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <div className="error-icon">!</div>
          <h2>Oups, une erreur est survenue</h2>
          <p>{error}</p>
          <button onClick={loadOrders} className="btn-retry">
            Réessayer
          </button>
        </div>

        <style jsx>{`
          .page-container {
            min-height: 100vh;
            padding-top: 120px;
            padding-bottom: 80px;
          }

          .error-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
            text-align: center;
            padding: 40px;
          }

          .error-icon {
            width: 80px;
            height: 80px;
            background: #FEE2E2;
            color: #DC2626;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            font-weight: bold;
          }

          .error-state h2 {
            color: #1F2937;
            font-size: 24px;
            margin: 0;
          }

          .error-state p {
            color: #6B7280;
            margin: 0;
          }

          .btn-retry {
            padding: 14px 32px;
            background: #000;
            color: #fff;
            border: none;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-retry:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mes Commandes</h1>
        <p className="subtitle">Suivez l'état de vos commandes</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2>Aucune commande</h2>
          <p>Vous n'avez pas encore passé de commande</p>
          <Link to="/products" className="btn-shop">
            Découvrir notre collection
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const items = order.items || [];
            const total = order.total || items.reduce((sum, item) => {
              return sum + (item.price || item.product?.price || 0) * item.quantity;
            }, 0);
            const statusStyle = getStatusColor(order.status);

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-number">Commande #{order.id}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div
                    className="order-status"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {getStatusIcon(order.status)}
                    </svg>
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                <div className="order-items">
                  {items.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                      </div>
                      <div className="item-details">
                        <span className="item-name">
                          {item.productName || item.product?.name || "Produit"}
                        </span>
                        <span className="item-qty">Qté: {item.quantity}</span>
                      </div>
                      <span className="item-price">
                        {((item.price || item.product?.price || 0) * item.quantity).toFixed(2)} DH
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="more-items">
                      + {items.length - 3} autre{items.length - 3 > 1 ? 's' : ''} article{items.length - 3 > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">{total.toFixed(2)} DH</span>
                  </div>
                  <div className="order-actions">
                    {order.status === "PENDING" && (
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                      >
                        {cancellingId === order.id ? "Annulation..." : "Annuler"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
          max-width: 900px;
          margin: 0 auto;
          padding-left: 40px;
          padding-right: 40px;
        }

        .page-header {
          margin-bottom: 48px;
        }

        .page-header h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: 36px;
          font-weight: 600;
          color: #000;
          margin: 0 0 8px 0;
        }

        .subtitle {
          color: #6B7280;
          font-size: 16px;
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: #FAF7F2;
          border-radius: 24px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          color: #D4AF37;
          opacity: 0.5;
        }

        .empty-state h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          color: #1F2937;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          color: #6B7280;
          margin: 0 0 32px 0;
        }

        .btn-shop {
          display: inline-block;
          padding: 16px 40px;
          background: #000;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-shop:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .order-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .order-card:hover {
          border-color: #D4AF37;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          background: #FAF7F2;
          border-bottom: 1px solid #E5E7EB;
        }

        .order-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-number {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #000;
        }

        .order-date {
          font-size: 13px;
          color: #6B7280;
        }

        .order-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .order-status svg {
          width: 16px;
          height: 16px;
        }

        .order-items {
          padding: 24px;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #F3F4F6;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #FAF7F2 0%, #F3F4F6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-image svg {
          width: 24px;
          height: 24px;
          color: #D4AF37;
          opacity: 0.5;
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-name {
          font-weight: 500;
          color: #1F2937;
        }

        .item-qty {
          font-size: 13px;
          color: #6B7280;
        }

        .item-price {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          color: #000;
        }

        .more-items {
          text-align: center;
          padding: 12px;
          color: #6B7280;
          font-size: 14px;
          background: #F9FAFB;
          border-radius: 8px;
          margin-top: 12px;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: #FAFAFA;
          border-top: 1px solid #E5E7EB;
        }

        .order-total {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .total-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6B7280;
        }

        .total-amount {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #000;
        }

        .order-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: transparent;
          color: #DC2626;
          border: 1px solid #DC2626;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #DC2626;
          color: #fff;
        }

        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .page-container {
            padding-left: 20px;
            padding-right: 20px;
          }

          .page-header h1 {
            font-size: 28px;
          }

          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .order-footer {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .order-actions {
            width: 100%;
          }

          .btn-cancel {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
