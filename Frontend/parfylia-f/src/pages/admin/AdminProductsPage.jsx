import { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: ""
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/products");
      setProducts(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, productData);
      } else {
        await api.post("/admin/products", productData);
      }

      await loadProducts();
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      description: product.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      await loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      description: ""
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Gestion des Produits</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "15px", padding: "10px", background: "#ffe6e6", borderRadius: "5px" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            background: showForm ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          {showForm ? "Annuler" : "Ajouter un produit"}
        </button>
        <button
          onClick={loadProducts}
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

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}
        >
          <h3>{editingProduct ? "Modifier le produit" : "Nouveau produit"}</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <input
              type="text"
              name="name"
              placeholder="Nom du produit"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
            />
            <input
              type="text"
              name="brand"
              placeholder="Marque"
              value={formData.brand}
              onChange={handleChange}
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
            />
            <input
              type="text"
              name="category"
              placeholder="Catégorie"
              value={formData.category}
              onChange={handleChange}
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
            />
            <input
              type="number"
              name="price"
              placeholder="Prix (DH)"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              required
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", gridColumn: "1 / -1" }}
              rows="3"
            />
          </div>

          <div style={{ marginTop: "15px" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              {editingProduct ? "Mettre à jour" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={resetForm}
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
          </div>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Nom</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Marque</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Prix</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Stock</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: "20px", textAlign: "center" }}>
                Aucun produit trouvé
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{product.id}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{product.name}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{product.brand}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{product.price} DH</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{product.stock}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: "6px 12px",
                      marginRight: "5px",
                      background: "#ffc107",
                      color: "black",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
