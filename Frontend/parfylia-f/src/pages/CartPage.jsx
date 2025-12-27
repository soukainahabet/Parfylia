import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const { cart, loading, error, updateItem, removeItem, emptyCart, getCartTotal, getCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    await updateItem(itemId, newQuantity);
    setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    await removeItem(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Voulez-vous vraiment vider votre panier ?")) {
      await emptyCart();
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement de votre panier...</p>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = getCartTotal ? getCartTotal() : 0;
  const count = getCartCount ? getCartCount() : 0;

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Mon Panier</h1>
          {items.length > 0 && (
            <p className="items-count">{count} article{count > 1 ? 's' : ''}</p>
          )}
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2m4 3l1.5 9M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h2>Votre panier est vide</h2>
            <p>Découvrez notre collection de parfums d'exception</p>
            <Link to="/products" className="btn-primary">
              Explorer la collection
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className={`cart-item ${updatingItems[item.id] ? 'updating' : ''}`}>
                  <div className="item-image">
                    {item.product?.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product?.name} />
                    ) : (
                      <div className="image-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="item-details">
                    <div className="item-info">
                      <span className="item-brand">{item.product?.brand}</span>
                      <h3 className="item-name">{item.product?.name}</h3>
                      <p className="item-price">{item.product?.price?.toFixed(2)} DH</p>
                    </div>

                    <div className="item-actions">
                      <div className="quantity-control">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItems[item.id]}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updatingItems[item.id]}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingItems[item.id]}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <span className="total-label">Sous-total</span>
                    <span className="total-price">
                      {(item.product?.price * item.quantity).toFixed(2)} DH
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="summary-card">
                <h2 className="summary-title">Récapitulatif</h2>

                <div className="summary-row">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>

                <div className="summary-row">
                  <span>Livraison</span>
                  <span className="free">Gratuite</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>

                <button className="btn-checkout" onClick={handleCheckout}>
                  Passer la commande
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                <button className="btn-clear" onClick={handleClearCart}>
                  Vider le panier
                </button>

                <div className="summary-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>

              <Link to="/products" className="continue-shopping">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Continuer mes achats
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
  .cart-page {
    margin-top: 80px;
    min-height: calc(100vh - 80px);
    background: #FAF7F2;
    padding: 60px 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .page-header {
    margin-bottom: 40px;
  }

  .page-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .items-count {
    color: #6B7280;
    font-size: 15px;
  }

  .alert-error {
    padding: 16px 20px;
    background: #FEE2E2;
    color: #991B1B;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  /* Empty Cart */
  .empty-cart {
    text-align: center;
    padding: 100px 20px;
    background: #fff;
    border-radius: 20px;
  }

  .empty-icon svg {
    width: 80px;
    height: 80px;
    color: #D4AF37;
    opacity: 0.5;
    margin-bottom: 24px;
  }

  .empty-cart h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .empty-cart p {
    color: #6B7280;
    margin-bottom: 32px;
  }

  .btn-primary {
    display: inline-block;
    padding: 16px 40px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  /* Cart Layout */
  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 40px;
    align-items: start;
  }

  /* Cart Items */
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .cart-item {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 24px;
    padding: 24px;
    background: #fff;
    border-radius: 16px;
    transition: opacity 0.3s ease;
  }

  .cart-item.updating {
    opacity: 0.6;
    pointer-events: none;
  }

  .item-image {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    background: #FAF7F2;
  }

  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-placeholder svg {
    width: 40px;
    height: 40px;
    color: #D4AF37;
    opacity: 0.4;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .item-brand {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #9CA3AF;
  }

  .item-name {
    font-size: 18px;
    font-weight: 600;
    margin: 6px 0;
  }

  .item-price {
    color: #6B7280;
    font-size: 15px;
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .quantity-control {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #FAF7F2;
    padding: 8px 12px;
    border-radius: 10px;
  }

  .quantity-control button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .quantity-control button:hover:not(:disabled) {
    background: #000;
    border-color: #000;
  }

  .quantity-control button:hover:not(:disabled) svg {
    color: #fff;
  }

  .quantity-control button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .quantity-control button svg {
    width: 14px;
    height: 14px;
  }

  .quantity {
    min-width: 24px;
    text-align: center;
    font-weight: 600;
  }

  .remove-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #9CA3AF;
    transition: all 0.2s ease;
  }

  .remove-btn:hover {
    color: #DC2626;
  }

  .remove-btn svg {
    width: 20px;
    height: 20px;
  }

  .item-total {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  .total-label {
    font-size: 12px;
    color: #9CA3AF;
    margin-bottom: 4px;
  }

  .total-price {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #D4AF37;
  }

  /* Cart Summary */
  .cart-summary {
    position: sticky;
    top: 140px;
  }

  .summary-card {
    background: #fff;
    border-radius: 20px;
    padding: 32px;
  }

  .summary-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 15px;
  }

  .summary-row .free {
    color: #16A34A;
    font-weight: 500;
  }

  .summary-divider {
    height: 1px;
    background: #E5E7EB;
    margin: 20px 0;
  }

  .summary-row.total {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .summary-row.total span:last-child {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #D4AF37;
  }

  .btn-checkout {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 18px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-checkout svg {
    width: 18px;
    height: 18px;
  }

  .btn-checkout:hover {
    background: #D4AF37;
    transform: translateY(-2px);
  }

  .btn-clear {
    width: 100%;
    padding: 14px;
    margin-top: 12px;
    font-size: 14px;
    font-weight: 500;
    background: transparent;
    color: #6B7280;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .btn-clear:hover {
    color: #DC2626;
  }

  .summary-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #E5E7EB;
    font-size: 13px;
    color: #6B7280;
  }

  .summary-info svg {
    width: 18px;
    height: 18px;
    color: #16A34A;
  }

  .continue-shopping {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    font-size: 14px;
    font-weight: 500;
    color: #6B7280;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .continue-shopping:hover {
    color: #000;
  }

  .continue-shopping svg {
    width: 18px;
    height: 18px;
  }

  /* Loading */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
    background: #fff;
    border-radius: 20px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid #E5E7EB;
    border-top-color: #D4AF37;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .cart-layout {
      grid-template-columns: 1fr;
    }

    .cart-summary {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 20px;
    }

    .cart-item {
      grid-template-columns: 80px 1fr;
      gap: 16px;
    }

    .item-image {
      width: 80px;
      height: 80px;
    }

    .item-total {
      grid-column: span 2;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #E5E7EB;
    }
  }
`;
