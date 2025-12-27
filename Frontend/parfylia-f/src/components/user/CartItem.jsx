import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function CartItem({ item }) {
  const { updateItem, removeItem } = useContext(CartContext);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    await updateItem(item.id, newQuantity);
  };

  const handleRemove = async () => {
    if (window.confirm("Supprimer cet article du panier ?")) {
      await removeItem(item.id);
    }
  };

  const product = item.product || {};

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px",
        borderBottom: "1px solid #eee",
        marginBottom: "10px"
      }}
    >
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: "0 0 5px 0" }}>{product.name || "Produit"}</h4>
        <p style={{ margin: "0", color: "#666" }}>{product.brand}</p>
        <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
          {product.price?.toFixed(2)} DH
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          style={{
            width: "30px",
            height: "30px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            background: "#f5f5f5",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          -
        </button>

        <span style={{ minWidth: "30px", textAlign: "center" }}>
          {item.quantity}
        </span>

        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          style={{
            width: "30px",
            height: "30px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            background: "#f5f5f5",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          +
        </button>
      </div>

      <div style={{ marginLeft: "20px", minWidth: "100px", textAlign: "right" }}>
        <p style={{ fontWeight: "bold", margin: "0" }}>
          {((product.price || 0) * item.quantity).toFixed(2)} DH
        </p>
      </div>

      <button
        onClick={handleRemove}
        style={{
          marginLeft: "15px",
          padding: "8px 12px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Supprimer
      </button>
    </div>
  );
}
