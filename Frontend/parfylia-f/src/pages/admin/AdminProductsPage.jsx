import { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockEdit, setStockEdit] = useState({ id: null, value: 0 });
  const [neo4jCategories, setNeo4jCategories] = useState([]);
  const [neo4jBrands, setNeo4jBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: ""
  });

  useEffect(() => {
    loadProducts();
    loadNeo4jData();
  }, []);

  const loadNeo4jData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get("/admin/categories"),
        api.get("/admin/brands")
      ]);
      setNeo4jCategories(catRes.data || []);
      setNeo4jBrands(brandRes.data || []);
    } catch (err) {
      console.error("Erreur chargement Neo4j:", err);
    }
  };

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
      alert("Erreur lors de la sauvegarde: " + (err.response?.data?.message || err.message));
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
      description: product.description || "",
      imageUrl: product.imageUrl || ""
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

  const handleStockUpdate = async (id, newStock) => {
    if (newStock < 0) return;
    try {
      await api.patch(`/admin/products/${id}/stock`, { stock: newStock });
      await loadProducts();
      setStockEdit({ id: null, value: 0 });
    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Erreur lors de la mise à jour du stock");
    }
  };

  const handleLinkCategory = async (productId, categoryId) => {
    try {
      await api.post(`/admin/categories/${categoryId}/link/${productId}`);
      alert(`Produit lié à la catégorie dans Neo4j`);
      loadNeo4jData();
    } catch (err) {
      console.error("Error linking category:", err);
      alert("Erreur lors de l'association: " + (err.response?.data?.error || err.message));
    }
  };

  const handleLinkBrand = async (productId, brandId) => {
    try {
      await api.post(`/admin/brands/${brandId}/link/${productId}`);
      alert(`Produit lié à la marque dans Neo4j`);
      loadNeo4jData();
    } catch (err) {
      console.error("Error linking brand:", err);
      alert("Erreur lors de l'association: " + (err.response?.data?.error || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      imageUrl: ""
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "100px 40px 40px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>Gestion des Produits</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "15px", padding: "10px", background: "#ffe6e6", borderRadius: "5px" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            background: showForm ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {showForm ? "Annuler" : "+ Ajouter un parfum"}
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
        <button
          onClick={async () => {
            try {
              const res = await api.post("/admin/products/sync-neo4j");
              alert(`Sync Neo4j: ${res.data.created} créés, ${res.data.linked} liés`);
            } catch (err) {
              alert("Erreur sync: " + err.message);
            }
          }}
          style={{
            padding: "10px 20px",
            background: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Sync Neo4j
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f9f9f9",
            padding: "25px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #ddd"
          }}
        >
          <h3 style={{ marginTop: 0 }}>{editingProduct ? "Modifier le produit" : "Nouveau parfum"}</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Nom *</label>
              <input
                type="text"
                name="name"
                placeholder="Ex: Sauvage Eau de Parfum"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Marque</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" }}
              >
                <option value="">-- Sélectionner --</option>
                {neo4jBrands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Catégorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" }}
              >
                <option value="">-- Sélectionner --</option>
                {neo4jCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Prix (DH) *</label>
              <input
                type="number"
                name="price"
                placeholder="Ex: 1200"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Stock *</label>
              <input
                type="number"
                name="stock"
                placeholder="Ex: 50"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Image URL</label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Description</label>
              <textarea
                name="description"
                placeholder="Description du parfum..."
                value={formData.description}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" }}
                rows="3"
              />
            </div>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{
                padding: "12px 25px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {editingProduct ? "Mettre à jour" : "Ajouter le parfum"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: "12px 25px",
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
          <tr style={{ background: "#343a40", color: "white" }}>
            <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Image</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Nom</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Marque</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Prix</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Stock</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center" }}>
                Aucun produit trouvé
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>{product.id}</td>
                <td style={{ padding: "12px" }}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ color: "#999" }}>-</span>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  <strong>{product.name}</strong>
                  {product.description && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                      {product.description.substring(0, 50)}...
                    </div>
                  )}
                </td>
                <td style={{ padding: "12px" }}>{product.brand || "-"}</td>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{product.price} DH</td>
                <td style={{ padding: "12px" }}>
                  {stockEdit.id === product.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <input
                        type="number"
                        value={stockEdit.value}
                        onChange={(e) => setStockEdit({ ...stockEdit, value: parseInt(e.target.value) || 0 })}
                        style={{ width: "60px", padding: "5px", borderRadius: "3px", border: "1px solid #ddd" }}
                        min="0"
                      />
                      <button
                        onClick={() => handleStockUpdate(product.id, stockEdit.value)}
                        style={{ padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                      >
                        OK
                      </button>
                      <button
                        onClick={() => setStockEdit({ id: null, value: 0 })}
                        style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: product.stock > 10 ? "#d4edda" : product.stock > 0 ? "#fff3cd" : "#f8d7da",
                        color: product.stock > 10 ? "#155724" : product.stock > 0 ? "#856404" : "#721c24"
                      }}>
                        {product.stock}
                      </span>
                      <button
                        onClick={() => setStockEdit({ id: product.id, value: product.stock })}
                        style={{ padding: "3px 8px", background: "#17a2b8", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", fontSize: "12px" }}
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        padding: "6px 12px",
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
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleLinkCategory(product.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      style={{
                        padding: "6px",
                        borderRadius: "3px",
                        border: "1px solid #6f42c1",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      <option value="">+ Catégorie</option>
                      {neo4jCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleLinkBrand(product.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      style={{
                        padding: "6px",
                        borderRadius: "3px",
                        border: "1px solid #28a745",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      <option value="">+ Marque</option>
                      {neo4jBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", padding: "15px", background: "#e9ecef", borderRadius: "5px" }}>
        <strong>Total: {products.length} produits</strong>
        <span style={{ marginLeft: "20px" }}>
          Stock total: {products.reduce((sum, p) => sum + (p.stock || 0), 0)} unités
        </span>
      </div>
    </div>
  );
}
