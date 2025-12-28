import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/axiosConfig";

export default function CategoryProductsPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [category]);

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Récupérer les IDs des produits de la catégorie
      const categoryResponse = await api.get(`/categories/${category}/products`);
      const productIds = categoryResponse.data.productIds;

      if (!productIds || productIds.length === 0) {
        setProducts([]);
        return;
      }

      // 2. Récupérer tous les produits
      const productsResponse = await api.get("/products");
      const allProducts = productsResponse.data;

      // 3. Filtrer les produits qui sont dans la catégorie
      const filteredProducts = allProducts.filter(p => productIds.includes(p.id));
      setProducts(filteredProducts);

    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>

        {/* Navigation par catégories */}
        <div style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          <Link
            to="/products"
            style={{
              padding: "10px 24px",
              background: "#fff",
              border: "2px solid #ddd",
              borderRadius: "30px",
              textDecoration: "none",
              color: "#333",
              fontWeight: "500",
              transition: "all 0.3s"
            }}
          >
            Tous les produits
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products/category/${cat.name}`}
              style={{
                padding: "10px 24px",
                background: cat.name === category ? "#000" : "#fff",
                color: cat.name === category ? "#fff" : "#333",
                border: cat.name === category ? "2px solid #000" : "2px solid #ddd",
                borderRadius: "30px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "all 0.3s"
              }}
            >
              {cat.name} ({cat.productCount})
            </Link>
          ))}
        </div>

        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
            {decodeURIComponent(category)}
          </h1>
          <p style={{ color: "#666" }}>
            {products.length} parfum{products.length !== 1 ? "s" : ""} dans cette catégorie
          </p>
        </div>

        {error && (
          <div style={{
            padding: "20px",
            background: "#f8d7da",
            color: "#721c24",
            borderRadius: "10px",
            marginBottom: "30px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p>Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 2px 15px rgba(0,0,0,0.05)"
          }}>
            <h2 style={{ color: "#666" }}>Aucun produit dans cette catégorie</h2>
            <p style={{ color: "#999" }}>Revenez bientôt pour découvrir nos nouveautés</p>
            <Link
              to="/products"
              style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "12px 30px",
                background: "#000",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none"
              }}
            >
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "30px"
          }}>
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit"
                }}
              >
                <div style={{
                  background: "#fff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                }}
                >
                  <div style={{
                    height: "280px",
                    background: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                  }}>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain"
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "120px",
                        height: "160px",
                        background: "linear-gradient(135deg, #D4AF37 0%, #F4E5C2 100%)",
                        borderRadius: "8px"
                      }} />
                    )}
                  </div>

                  <div style={{ padding: "20px" }}>
                    {product.brand && (
                      <span style={{
                        fontSize: "12px",
                        color: "#D4AF37",
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                      }}>
                        {product.brand}
                      </span>
                    )}
                    <h3 style={{
                      margin: "8px 0",
                      fontSize: "18px",
                      fontWeight: "600"
                    }}>
                      {product.name}
                    </h3>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#000"
                      }}>
                        {product.price?.toFixed(2)} MAD
                      </span>
                      {product.stock <= 5 && product.stock > 0 && (
                        <span style={{
                          fontSize: "12px",
                          color: "#ff9800",
                          background: "#fff3e0",
                          padding: "4px 8px",
                          borderRadius: "4px"
                        }}>
                          Plus que {product.stock}
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span style={{
                          fontSize: "12px",
                          color: "#c62828",
                          background: "#ffebee",
                          padding: "4px 8px",
                          borderRadius: "4px"
                        }}>
                          Rupture
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
