import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = getCartCount ? getCartCount() : 0;
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-text">PARFYLIA</span>
          <span className="logo-subtitle">Haute Parfumerie</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Collection
              </Link>
            </li>

            {user && (
              <>
                <li>
                  <Link
                    to="/orders"
                    className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mes Commandes
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {user ? (
            <>
              {/* Panier */}
              <Link to="/cart" className="nav-icon-link">
                <div className="nav-icon-wrapper">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2m4 3l1.5 9M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </div>
              </Link>

              {/* Profil */}
              <Link to="/profile" className="nav-icon-link">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              </Link>

              {/* Admin Dropdown */}
              {isAdmin && (
                <div className="admin-dropdown">
                  <button
                    className="admin-trigger"
                    onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  {adminDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link to="/admin/users" className="dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                        Utilisateurs
                      </Link>
                      <Link to="/admin/products" className="dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                        Produits
                      </Link>
                      <Link to="/admin/categories" className="dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                        Catégories
                      </Link>
                      <Link to="/admin/brands" className="dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                        Marques
                      </Link>
                      <Link to="/admin/orders" className="dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                        Commandes
                      </Link>
                      <Link to="/admin/graph" className="dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                        Graphe Neo4j
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Logout */}
              <button onClick={handleLogout} className="btn-logout">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                S'inscrire
              </Link>
            </div>
          )}

          {/* Menu Mobile Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span className={mobileMenuOpen ? 'open' : ''}></span>
            <span className={mobileMenuOpen ? 'open' : ''}></span>
            <span className={mobileMenuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          z-index: 1000;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .logo {
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }

        .logo-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 6px;
          color: #000;
        }

        .logo-subtitle {
          font-size: 10px;
          letter-spacing: 3px;
          color: #D4AF37;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .nav {
          display: flex;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 48px;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #6B7280;
          text-decoration: none;
          padding: 8px 0;
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #D4AF37;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #D4AF37;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-icon-link,
        .btn-logout,
        .admin-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 50%;
        }

        .nav-icon-link:hover,
        .btn-logout:hover,
        .admin-trigger:hover {
          background: #FAF7F2;
        }

        .nav-icon {
          width: 22px;
          height: 22px;
          color: #000;
        }

        .nav-icon-wrapper {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 18px;
          height: 18px;
          background: #D4AF37;
          color: #000;
          font-size: 10px;
          font-weight: 600;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          min-width: 180px;
          padding: 8px 0;
          animation: fadeIn 0.2s ease;
        }

        .dropdown-item {
          display: block;
          padding: 12px 20px;
          font-size: 14px;
          color: #000;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: #FAF7F2;
          color: #D4AF37;
        }

        .auth-buttons {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 10px 24px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #000;
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
          background: transparent;
          color: #000;
          border: 1px solid #000;
        }

        .btn-secondary:hover {
          background: #000;
          color: #fff;
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .menu-toggle span {
          width: 24px;
          height: 2px;
          background: #000;
          transition: all 0.3s ease;
        }

        .menu-toggle span.open:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .menu-toggle span.open:nth-child(2) {
          opacity: 0;
        }

        .menu-toggle span.open:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .nav-links {
            gap: 32px;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 20px;
          }

          .nav {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: white;
            padding: 24px;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }

          .nav-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .nav-links {
            flex-direction: column;
            gap: 0;
          }

          .nav-link {
            padding: 16px 0;
            font-size: 16px;
            border-bottom: 1px solid #f0f0f0;
          }

          .menu-toggle {
            display: flex;
          }

          .auth-buttons {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
