import { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add or edit
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/categories");
      setCategories(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const handleOpenEditModal = (category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (modalMode === "add") {
        await api.post("/admin/categories", formData);
        setSuccess("Catégorie créée avec succès");
      } else {
        await api.put(`/admin/categories/${selectedCategory.id}`, formData);
        setSuccess("Catégorie modifiée avec succès");
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'opération");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer la catégorie "${name}" ?`)) return;

    try {
      await api.delete(`/admin/categories/${id}`);
      setSuccess("Catégorie supprimée");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await api.get(`/admin/categories/${id}`);
      setCategoryDetail(response.data);
      setShowDetailModal(true);
    } catch (err) {
      setError("Erreur lors du chargement des détails");
    }
  };

  const handleUnlinkProduct = async (productId) => {
    if (!categoryDetail) return;
    try {
      await api.delete(`/admin/categories/${categoryDetail.id}/unlink/${productId}`);
      // Recharger les détails
      const response = await api.get(`/admin/categories/${categoryDetail.id}`);
      setCategoryDetail(response.data);
      loadCategories();
      setSuccess("Produit délié");
    } catch (err) {
      setError("Erreur lors du déliement");
    }
  };

  return (
    <div style={{ padding: "100px 40px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: 0 }}>Gestion des Catégories</h1>
          <button
            onClick={handleOpenAddModal}
            style={{
              padding: "12px 24px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            + Nouvelle Catégorie
          </button>
        </div>

        {error && (
          <div style={{ padding: "15px", background: "#f8d7da", color: "#721c24", borderRadius: "8px", marginBottom: "20px" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: "15px", background: "#d4edda", color: "#155724", borderRadius: "8px", marginBottom: "20px" }}>
            {success}
          </div>
        )}

        {loading ? (
          <p>Chargement...</p>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "#f8f9fa", borderRadius: "12px" }}>
            <p style={{ fontSize: "18px", color: "#666" }}>Aucune catégorie trouvée</p>
            <p style={{ color: "#999" }}>Créez votre première catégorie pour commencer</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  border: "1px solid #eee"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <h3 style={{ margin: 0, fontSize: "20px" }}>{cat.name}</h3>
                  <span style={{
                    background: "#e3f2fd",
                    color: "#1976d2",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}>
                    {cat.productCount} produit{cat.productCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {cat.description && (
                  <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>{cat.description}</p>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleViewDetail(cat.id)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#f8f9fa",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#fff3e0",
                      border: "1px solid #ffcc80",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "#e65100"
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#ffebee",
                      border: "1px solid #ef9a9a",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "#c62828"
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "30px",
            width: "90%",
            maxWidth: "500px"
          }}>
            <h2 style={{ marginTop: 0 }}>
              {modalMode === "add" ? "Nouvelle Catégorie" : "Modifier la Catégorie"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box"
                  }}
                  placeholder="Ex: Homme, Femme, Luxe..."
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    resize: "vertical",
                    boxSizing: "border-box"
                  }}
                  placeholder="Description de la catégorie..."
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "12px 24px",
                    background: "#f5f5f5",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    background: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  {modalMode === "add" ? "Créer" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {showDetailModal && categoryDetail && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "30px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>{categoryDetail.name}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer"
                }}
              >
                x
              </button>
            </div>

            {categoryDetail.description && (
              <p style={{ color: "#666", marginBottom: "20px" }}>{categoryDetail.description}</p>
            )}

            <h3>Produits ({categoryDetail.products?.length || 0})</h3>

            {categoryDetail.products?.length === 0 ? (
              <p style={{ color: "#999" }}>Aucun produit dans cette catégorie</p>
            ) : (
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {categoryDetail.products?.map((product) => (
                  <div
                    key={product.mysqlId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      marginBottom: "8px"
                    }}
                  >
                    <span>{product.name}</span>
                    <button
                      onClick={() => handleUnlinkProduct(product.mysqlId)}
                      style={{
                        padding: "6px 12px",
                        background: "#ffebee",
                        border: "none",
                        borderRadius: "4px",
                        color: "#c62828",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
