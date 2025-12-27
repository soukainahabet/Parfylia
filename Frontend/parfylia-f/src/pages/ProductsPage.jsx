import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("name");
  const { addItem } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  useEffect(() => {
    getAllProducts()
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger les produits");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery) {
      result = result.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by brand
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name": return a.name?.localeCompare(b.name);
        default: return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, searchQuery, selectedBrand, priceRange, sortBy]);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addItem) {
      await addItem(product.id, 1);
    }
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <span className="page-label">Collection</span>
          <h1 className="page-title">Nos Parfums</h1>
          <p className="page-subtitle">
            Découvrez notre sélection de fragrances d'exception
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="products-layout">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar">
              <div className="filter-section">
                <h3 className="filter-title">Rechercher</h3>
                <div className="search-input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Nom ou marque..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Marques</h3>
                <div className="filter-options">
                  <button
                    className={`filter-option ${!selectedBrand ? 'active' : ''}`}
                    onClick={() => setSelectedBrand(null)}
                  >
                    Toutes les marques
                  </button>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      className={`filter-option ${selectedBrand === brand ? 'active' : ''}`}
                      onClick={() => setSelectedBrand(brand)}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Prix</h3>
                <div className="price-inputs">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    placeholder="Min"
                  />
                  <span>—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Nom A-Z</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="products-main">
              <div className="products-header">
                <p className="products-count">
                  {filteredProducts.length} parfum{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>

              {loading ? (
                <div className="products-grid">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="product-skeleton">
                      <div className="skeleton-image"></div>
                      <div className="skeleton-content">
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text short"></div>
                        <div className="skeleton-text shorter"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>{error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <h3>Aucun parfum trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedBrand(null); setPriceRange([0, 500]); }}>
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <Link to={`/products/${product.id}`} key={product.id} className="product-card">
                      <div className="product-image">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <div className="product-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <span className="product-badge stock-low">Stock limité</span>
                        )}
                        {product.stock === 0 && (
                          <span className="product-badge out-of-stock">Rupture</span>
                        )}
                      </div>
                      <div className="product-info">
                        <span className="product-brand">{product.brand}</span>
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-footer">
                          <p className="product-price">{product.price?.toFixed(2)} DH</p>
                          {user && product.stock > 0 && (
                            <button
                              className="add-to-cart-btn"
                              onClick={(e) => handleAddToCart(product, e)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <style jsx>{`
        .products-page {
          margin-top: 80px;
          min-height: calc(100vh - 80px);
          background: #fff;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Page Header */
        .page-header {
          padding: 80px 0;
          background: linear-gradient(135deg, #FAF7F2 0%, #fff 100%);
          text-align: center;
        }

        .page-label {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 16px;
        }

        .page-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .page-subtitle {
          font-size: 18px;
          color: #6B7280;
        }

        /* Content Layout */
        .page-content {
          padding: 60px 0 100px;
        }

        .products-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
        }

        /* Sidebar Filters */
        .filters-sidebar {
          position: sticky;
          top: 140px;
          height: fit-content;
        }

        .filter-section {
          margin-bottom: 32px;
        }

        .filter-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 16px;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-input-wrapper svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #9CA3AF;
        }

        .search-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          font-size: 14px;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          background: #FAF7F2;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #D4AF37;
          background: #fff;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-option {
          padding: 12px 16px;
          font-size: 14px;
          text-align: left;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6B7280;
        }

        .filter-option:hover {
          background: #FAF7F2;
          color: #000;
        }

        .filter-option.active {
          background: #000;
          color: #fff;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .price-inputs input {
          flex: 1;
          padding: 12px;
          font-size: 14px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          background: #FAF7F2;
          outline: none;
          text-align: center;
        }

        .price-inputs input:focus {
          border-color: #D4AF37;
        }

        .price-inputs span {
          color: #9CA3AF;
        }

        .sort-select {
          width: 100%;
          padding: 14px 16px;
          font-size: 14px;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          background: #FAF7F2;
          cursor: pointer;
          outline: none;
        }

        .sort-select:focus {
          border-color: #D4AF37;
        }

        /* Products Main */
        .products-main {
          min-width: 0;
        }

        .products-header {
          margin-bottom: 32px;
        }

        .products-count {
          font-size: 14px;
          color: #6B7280;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        /* Product Card */
        .product-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.4s ease;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .product-image {
          position: relative;
          aspect-ratio: 1;
          background: #FAF7F2;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.08);
        }

        .product-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FAF7F2 0%, #f0ebe3 100%);
        }

        .product-placeholder svg {
          width: 60px;
          height: 60px;
          color: #D4AF37;
          opacity: 0.4;
        }

        .product-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 6px;
        }

        .stock-low {
          background: #FEF3C7;
          color: #92400E;
        }

        .out-of-stock {
          background: #FEE2E2;
          color: #991B1B;
        }

        .product-info {
          padding: 24px;
        }

        .product-brand {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #9CA3AF;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin: 8px 0 16px;
          line-height: 1.4;
        }

        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-price {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #D4AF37;
        }

        .add-to-cart-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-to-cart-btn svg {
          width: 18px;
          height: 18px;
          color: #fff;
        }

        .add-to-cart-btn:hover {
          background: #D4AF37;
          transform: scale(1.1);
        }

        /* Skeleton Loading */
        .product-skeleton {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .skeleton-image {
          aspect-ratio: 1;
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-content {
          padding: 24px;
        }

        .skeleton-text {
          height: 14px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 7px;
          margin-bottom: 12px;
        }

        .skeleton-text.short { width: 60%; }
        .skeleton-text.shorter { width: 40%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-state svg {
          width: 64px;
          height: 64px;
          color: #D4AF37;
          opacity: 0.5;
          margin-bottom: 24px;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #6B7280;
          margin-bottom: 24px;
        }

        .empty-state button {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .empty-state button:hover {
          background: #D4AF37;
        }

        .error-state {
          text-align: center;
          padding: 60px 20px;
          color: #DC2626;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .products-layout {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            position: static;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            padding: 24px;
            background: #FAF7F2;
            border-radius: 16px;
            margin-bottom: 40px;
          }

          .filter-section {
            margin-bottom: 0;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 20px;
          }

          .page-header {
            padding: 60px 0;
          }

          .page-title {
            font-size: 32px;
          }

          .filters-sidebar {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
