import { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [formData, setFormData] = useState({ name: "", country: "", logoUrl: "" });

  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [brandDetail, setBrandDetail] = useState(null);

  // Liste des pays courants pour les parfums
  const countries = [
    "France", "Italie", "Espagne", "États-Unis", "Royaume-Uni",
    "Allemagne", "Suisse", "Japon", "Émirats Arabes Unis", "Autre"
  ];

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/brands");
      setBrands(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des marques");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ name: "", country: "", logoUrl: "" });
    setShowModal(true);
  };

  const handleOpenEditModal = (brand) => {
    setModalMode("edit");
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      country: brand.country || "",
      logoUrl: brand.logoUrl || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (modalMode === "add") {
        await api.post("/admin/brands", formData);
        setSuccess("Marque créée avec succès");
      } else {
        await api.put(`/admin/brands/${selectedBrand.id}`, formData);
        setSuccess("Marque modifiée avec succès");
      }
      setShowModal(false);
      loadBrands();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'opération");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer la marque "${name}" ?`)) return;

    try {
      await api.delete(`/admin/brands/${id}`);
      setSuccess("Marque supprimée");
      loadBrands();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await api.get(`/admin/brands/${id}`);
      setBrandDetail(response.data);
      setShowDetailModal(true);
    } catch (err) {
      setError("Erreur lors du chargement des détails");
    }
  };

  const handleUnlinkProduct = async (productId) => {
    if (!brandDetail) return;
    try {
      await api.delete(`/admin/brands/${brandDetail.id}/unlink/${productId}`);
      const response = await api.get(`/admin/brands/${brandDetail.id}`);
      setBrandDetail(response.data);
      loadBrands();
      setSuccess("Produit délié");
    } catch (err) {
      setError("Erreur lors du déliement");
    }
  };

  return (
    <div style={{ padding: "100px 40px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: 0 }}>Gestion des Marques</h1>
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
            + Nouvelle Marque
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
        ) : brands.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "#f8f9fa", borderRadius: "12px" }}>
            <p style={{ fontSize: "18px", color: "#666" }}>Aucune marque trouvée</p>
            <p style={{ color: "#999" }}>Créez votre première marque pour commencer</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {brands.map((brand) => (
              <div
                key={brand.id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  border: "1px solid #eee"
                }}
              >
                <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        background: "#f8f9fa"
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "24px",
                      fontWeight: "bold"
                    }}>
                      {brand.name.charAt(0)}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>{brand.name}</h3>
                    {brand.country && (
                      <span style={{ color: "#666", fontSize: "14px" }}>{brand.country}</span>
                    )}
                  </div>
                  <span style={{
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    height: "fit-content"
                  }}>
                    {brand.productCount} produit{brand.productCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleViewDetail(brand.id)}
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
                    onClick={() => handleOpenEditModal(brand)}
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
                    onClick={() => handleDelete(brand.id, brand.name)}
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
              {modalMode === "add" ? "Nouvelle Marque" : "Modifier la Marque"}
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
                  placeholder="Ex: Chanel, Dior, Guerlain..."
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Pays d'origine</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="">-- Sélectionner --</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>URL du Logo</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box"
                  }}
                  placeholder="https://..."
                />
                {formData.logoUrl && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <img
                      src={formData.logoUrl}
                      alt="Preview"
                      style={{ maxHeight: "80px", maxWidth: "100%" }}
                      onError={(e) => e.target.style.display = "none"}
                    />
                  </div>
                )}
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
      {showDetailModal && brandDetail && (
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
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {brandDetail.logoUrl && (
                  <img src={brandDetail.logoUrl} alt={brandDetail.name} style={{ height: "50px" }} />
                )}
                <div>
                  <h2 style={{ margin: 0 }}>{brandDetail.name}</h2>
                  {brandDetail.country && (
                    <span style={{ color: "#666" }}>{brandDetail.country}</span>
                  )}
                </div>
              </div>
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

            <h3>Produits ({brandDetail.products?.length || 0})</h3>

            {brandDetail.products?.length === 0 ? (
              <p style={{ color: "#999" }}>Aucun produit pour cette marque</p>
            ) : (
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {brandDetail.products?.map((product) => (
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
