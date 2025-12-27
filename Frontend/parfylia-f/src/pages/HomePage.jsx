import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(res => {
        setFeaturedProducts(res.data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <span className="hero-label">Collection 2025</span>
          <h1 className="hero-title">L'Art de la Parfumerie</h1>
          <p className="hero-subtitle">
            Découvrez notre sélection exclusive de parfums de luxe,
            créés par les plus grandes maisons françaises et italiennes.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-hero-primary">
              Explorer la Collection
            </Link>
            <Link to="/products" className="btn-hero-secondary">
              Nouveautés
            </Link>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Défiler</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="feature-title">Livraison Premium</h3>
              <p className="feature-text">Livraison gratuite et soignée pour toute commande</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="feature-title">Authenticité Garantie</h3>
              <p className="feature-text">100% de parfums originaux certifiés</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Support 24/7</h3>
              <p className="feature-text">Notre équipe est disponible à tout moment</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Emballage Cadeau</h3>
              <p className="feature-text">Écrin luxueux offert sur demande</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Sélection</span>
            <h2 className="section-title">Parfums d'Exception</h2>
            <p className="section-subtitle">
              Notre sélection des fragrances les plus recherchées
            </p>
          </div>

          {loading ? (
            <div className="products-loading">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
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
                    <div className="product-overlay">
                      <span>Voir le produit</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <span className="product-brand">{product.brand}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price?.toFixed(2)} DH</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/products" className="btn-view-all">
              Voir toute la collection
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            <Link to="/products?category=homme" className="category-card category-homme">
              <div className="category-content">
                <h3>Pour Lui</h3>
                <span>Découvrir</span>
              </div>
            </Link>
            <Link to="/products?category=femme" className="category-card category-femme">
              <div className="category-content">
                <h3>Pour Elle</h3>
                <span>Découvrir</span>
              </div>
            </Link>
            <Link to="/products?category=unisexe" className="category-card category-unisexe">
              <div className="category-content">
                <h3>Unisexe</h3>
                <span>Découvrir</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Restez Informé</h2>
            <p>Inscrivez-vous pour recevoir nos offres exclusives et nouveautés</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Votre email" />
              <button type="submit">S'inscrire</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>PARFYLIA</h3>
              <p>Haute Parfumerie depuis 2020</p>
            </div>
            <div className="footer-links">
              <h4>Navigation</h4>
              <Link to="/">Accueil</Link>
              <Link to="/products">Collection</Link>
              <Link to="/orders">Mes Commandes</Link>
            </div>
            <div className="footer-links">
              <h4>Service Client</h4>
              <span className="footer-text">Contact</span>
              <span className="footer-text">FAQ</span>
              <span className="footer-text">Livraison</span>
            </div>
            <div className="footer-links">
              <h4>Légal</h4>
              <span className="footer-text">CGV</span>
              <span className="footer-text">Politique de confidentialité</span>
              <span className="footer-text">Mentions légales</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Parfylia. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .home {
          margin-top: 80px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Hero */
        .hero {
          position: relative;
          height: calc(100vh - 80px);
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FAF7F2 0%, #fff 50%, #FAF7F2 100%);
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%);
        }

        .hero-content {
          position: relative;
          text-align: center;
          max-width: 800px;
          padding: 0 20px;
        }

        .hero-label {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 24px;
          padding: 8px 20px;
          border: 1px solid #D4AF37;
          border-radius: 30px;
        }

        .hero-title {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(40px, 8vw, 72px);
          font-weight: 700;
          line-height: 1.1;
          color: #000;
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #6B7280;
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-hero-primary,
        .btn-hero-secondary {
          padding: 16px 40px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-hero-primary {
          background: #000;
          color: #fff;
        }

        .btn-hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .btn-hero-secondary {
          background: transparent;
          color: #000;
          border: 1px solid #000;
        }

        .btn-hero-secondary:hover {
          background: #000;
          color: #fff;
        }

        .hero-scroll {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .hero-scroll span {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6B7280;
        }

        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, #D4AF37, transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.5); opacity: 0.5; }
        }

        /* Features */
        .features {
          padding: 80px 0;
          background: #fff;
          border-bottom: 1px solid #f0f0f0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }

        .feature {
          text-align: center;
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-icon svg {
          width: 32px;
          height: 32px;
          color: #D4AF37;
        }

        .feature-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .feature-text {
          font-size: 14px;
          color: #6B7280;
        }

        /* Featured Section */
        .featured-section {
          padding: 100px 0;
          background: #FAF7F2;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #D4AF37;
        }

        .section-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 40px;
          font-weight: 700;
          margin: 16px 0;
        }

        .section-subtitle {
          font-size: 16px;
          color: #6B7280;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .products-loading {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .product-skeleton {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
        }

        .skeleton-image {
          aspect-ratio: 1;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .skeleton-text {
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .skeleton-text.short {
          width: 60%;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .product-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.4s ease;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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
          transform: scale(1.05);
        }

        .product-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-placeholder svg {
          width: 60px;
          height: 60px;
          color: #D4AF37;
          opacity: 0.5;
        }

        .product-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-overlay {
          transform: translateY(0);
        }

        .product-overlay span {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 1px;
        }

        .product-info {
          padding: 24px;
        }

        .product-brand {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6B7280;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin: 8px 0;
        }

        .product-price {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #D4AF37;
        }

        .section-cta {
          text-align: center;
          margin-top: 60px;
        }

        .btn-view-all {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #000;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-view-all svg {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .btn-view-all:hover {
          color: #D4AF37;
        }

        .btn-view-all:hover svg {
          transform: translateX(5px);
        }

        /* Categories */
        .categories-section {
          padding: 100px 0;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .category-card {
          position: relative;
          height: 400px;
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          background: #1a1a1a;
        }

        .category-homme { background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); }
        .category-femme { background: linear-gradient(135deg, #d4af37 0%, #b8963d 100%); }
        .category-unisexe { background: linear-gradient(135deg, #FAF7F2 0%, #e8e0d5 100%); }

        .category-content {
          position: absolute;
          bottom: 40px;
          left: 40px;
        }

        .category-content h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }

        .category-unisexe .category-content h3 {
          color: #000;
        }

        .category-content span {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .category-unisexe .category-content span {
          color: #6B7280;
          border-bottom-color: #6B7280;
        }

        .category-card:hover {
          transform: scale(1.02);
          transition: transform 0.4s ease;
        }

        /* Newsletter */
        .newsletter {
          padding: 100px 0;
          background: #000;
          color: #fff;
        }

        .newsletter-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .newsletter h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .newsletter p {
          color: #9CA3AF;
          margin-bottom: 40px;
        }

        .newsletter-form {
          display: flex;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto;
        }

        .newsletter-form input {
          flex: 1;
          padding: 16px 24px;
          font-size: 15px;
          border: 1px solid #333;
          border-radius: 8px;
          background: transparent;
          color: #fff;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .newsletter-form input:focus {
          border-color: #D4AF37;
        }

        .newsletter-form input::placeholder {
          color: #666;
        }

        .newsletter-form button {
          padding: 16px 32px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: #D4AF37;
          color: #000;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .newsletter-form button:hover {
          background: #e5c04b;
          transform: translateY(-2px);
        }

        /* Footer */
        .footer {
          padding: 80px 0 40px;
          background: #0a0a0a;
          color: #fff;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-brand h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 4px;
          margin-bottom: 12px;
        }

        .footer-brand p {
          color: #6B7280;
          font-size: 14px;
        }

        .footer-links h4 {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 24px;
        }

        .footer-links a,
        .footer-links .footer-text {
          display: block;
          color: #9CA3AF;
          font-size: 14px;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #fff;
        }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid #1a1a1a;
          text-align: center;
        }

        .footer-bottom p {
          color: #6B7280;
          font-size: 13px;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .products-grid,
          .products-loading {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .products-grid,
          .products-loading {
            grid-template-columns: repeat(2, 1fr);
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .category-card {
            height: 300px;
          }

          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 20px;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .products-grid,
          .products-loading {
            grid-template-columns: 1fr;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </div>
  );
}
