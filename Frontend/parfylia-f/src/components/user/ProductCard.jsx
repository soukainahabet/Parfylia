import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "8px",
        width: "250px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}
    >
      <h3>{product.name}</h3>
      <p><strong>Marque:</strong> {product.brand}</p>
      <p><strong>Prix:</strong> {product.price} DH</p>
      <p><strong>Stock:</strong> {product.stock}</p>

      <Link
        to={`/products/${product.id}`}
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "8px 12px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "4px",
          textDecoration: "none"
        }}
      >
        Voir Détails
      </Link>
    </div>
  );
}
