import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getProductById } from "../services/productService";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProductById(id)
      .then(res => {
        setProduct(res.data);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de récupérer le produit");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    const success = await addItem(product.id, quantity);
    setAddingToCart(false);

    if (success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement du produit...</p>
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

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="error-state">
          <div className="error-icon">!</div>
          <h2>{error || "Produit introuvable"}</h2>
          <Link to="/products" className="btn-back">
            Retour aux produits
          </Link>
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
            gap: 20px;
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

          .btn-back {
            display: inline-block;
            padding: 14px 32px;
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

          .btn-back:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator">/</span>
        <Link to="/products">Collection</Link>
        <span className="separator">/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-layout">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <div className="image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="stock-badge low">Plus que {product.stock} en stock</span>
            )}
            {product.stock === 0 && (
              <span className="stock-badge out">Rupture de stock</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            {product.brand && (
              <Link to={`/brands/${product.brand}`} className="product-brand">
                {product.brand}
              </Link>
            )}
            <h1 className="product-name">{product.name}</h1>
            {product.category && (
              <span className="product-category">{product.category}</span>
            )}
          </div>

          <div className="product-price">
            <span className="price-amount">{product.price?.toFixed(2)} DH</span>
            <span className="price-info">TTC - Livraison offerte dès 500 DH</span>
          </div>

          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Notes de parfum si disponible */}
          {(product.topNotes || product.heartNotes || product.baseNotes) && (
            <div className="fragrance-notes">
              <h3>Notes olfactives</h3>
              <div className="notes-grid">
                {product.topNotes && (
                  <div className="note-group">
                    <span className="note-label">Notes de tête</span>
                    <span className="note-value">{product.topNotes}</span>
                  </div>
                )}
                {product.heartNotes && (
                  <div className="note-group">
                    <span className="note-label">Notes de cœur</span>
                    <span className="note-value">{product.heartNotes}</span>
                  </div>
                )}
                {product.baseNotes && (
                  <div className="note-group">
                    <span className="note-label">Notes de fond</span>
                    <span className="note-value">{product.baseNotes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <button
              className={`btn-add-to-cart ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
            >
              {addingToCart ? (
                <>
                  <span className="btn-spinner"></span>
                  Ajout en cours...
                </>
              ) : addedToCart ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Ajouté au panier
                </>
              ) : product.stock === 0 ? (
                'Rupture de stock'
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2m4 3l1.5 9M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  Ajouter au panier
                </>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M5 12l4-4m-4 4l4 4" />
              </svg>
              <span>Retours gratuits sous 14 jours</span>
            </div>
            <div className="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span>Paiement 100% sécurisé</span>
            </div>
            <div className="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Produits authentiques garantis</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
          max-width: 1400px;
          margin: 0 auto;
          padding-left: 40px;
          padding-right: 40px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
          font-size: 13px;
        }

        .breadcrumb a {
          color: #6B7280;
          text-decoration: none;
          transition: color 0.2s;
        }

        .breadcrumb a:hover {
          color: #D4AF37;
        }

        .breadcrumb .separator {
          color: #D1D5DB;
        }

        .breadcrumb .current {
          color: #1F2937;
          font-weight: 500;
        }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
        }

        @media (min-width: 1024px) {
          .product-layout {
            grid-template-columns: 1fr 1fr;
          }
        }

        .product-gallery {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .main-image {
          background: linear-gradient(135deg, #FAF7F2 0%, #F3F4F6 100%);
          border-radius: 24px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .image-placeholder {
          width: 120px;
          height: 120px;
          color: #D4AF37;
          opacity: 0.5;
        }

        .stock-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .stock-badge.low {
          background: #FEF3C7;
          color: #92400E;
        }

        .stock-badge.out {
          background: #FEE2E2;
          color: #991B1B;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .product-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .product-brand {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #D4AF37;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .product-brand:hover {
          opacity: 0.7;
        }

        .product-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 36px;
          font-weight: 600;
          color: #000;
          margin: 0;
          line-height: 1.2;
        }

        .product-category {
          font-size: 14px;
          color: #6B7280;
        }

        .product-price {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .price-amount {
          font-family: 'Montserrat', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #000;
        }

        .price-info {
          font-size: 13px;
          color: #6B7280;
        }

        .product-description h3,
        .fragrance-notes h3 {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #000;
          margin: 0 0 12px 0;
        }

        .product-description p {
          color: #4B5563;
          line-height: 1.8;
          margin: 0;
        }

        .fragrance-notes {
          background: #FAF7F2;
          padding: 24px;
          border-radius: 16px;
        }

        .notes-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .note-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .note-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9CA3AF;
        }

        .note-value {
          font-size: 15px;
          color: #1F2937;
        }

        .add-to-cart-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          background: #F3F4F6;
          border-radius: 12px;
          overflow: hidden;
        }

        .qty-btn {
          width: 48px;
          height: 48px;
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          color: #000;
          transition: all 0.2s;
        }

        .qty-btn:hover:not(:disabled) {
          background: #E5E7EB;
        }

        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .qty-value {
          width: 48px;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
        }

        .btn-add-to-cart {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 32px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-add-to-cart:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .btn-add-to-cart:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-add-to-cart.added {
          background: #059669;
        }

        .btn-add-to-cart svg {
          width: 20px;
          height: 20px;
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .product-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid #E5E7EB;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #6B7280;
          font-size: 14px;
        }

        .feature svg {
          width: 20px;
          height: 20px;
          color: #D4AF37;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .page-container {
            padding-left: 20px;
            padding-right: 20px;
          }

          .product-name {
            font-size: 28px;
          }

          .price-amount {
            font-size: 26px;
          }

          .add-to-cart-section {
            flex-direction: column;
          }

          .quantity-selector {
            width: 100%;
            justify-content: space-between;
          }

          .btn-add-to-cart {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
