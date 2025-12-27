import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getAddresses, createAddress } from "../services/addressService";
import { createOrder } from "../services/orderService";

export default function CheckoutPage() {
  const { cart, getCartTotal, getCartCount, loadCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: ""
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      } else {
        setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error("Erreur chargement adresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    setError("");

    if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city) {
      setError("Veuillez remplir tous les champs de l'adresse");
      return;
    }

    try {
      const created = await createAddress(newAddress);
      setAddresses([...addresses, created]);
      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
      setNewAddress({ fullName: "", phone: "", street: "", city: "" });
    } catch (err) {
      setError("Erreur lors de la création de l'adresse");
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      setError("Veuillez sélectionner ou créer une adresse de livraison");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createOrder({ addressId: selectedAddressId });
      setSuccess(true);
      if (loadCart) {
        await loadCart();
      }
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err) {
      console.error("Erreur création commande:", err);
      setError(err.response?.data?.message || "Erreur lors de la création de la commande");
    } finally {
      setSubmitting(false);
    }
  };

  const items = cart?.items || [];
  const total = getCartTotal ? getCartTotal() : 0;
  const count = getCartCount ? getCartCount() : 0;

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement...</p>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="success-state">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2>Commande confirmée !</h2>
            <p>Votre commande a été passée avec succès.</p>
            <p className="redirect-text">Redirection vers vos commandes...</p>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-state">
            <h2>Votre panier est vide</h2>
            <Link to="/products" className="btn-primary">
              Découvrir nos produits
            </Link>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <Link to="/cart" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour au panier
          </Link>
          <h1 className="page-title">Finaliser la commande</h1>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <div className="checkout-layout">
          {/* Address Section */}
          <div className="checkout-section">
            <h2 className="section-title">
              <span className="step-number">1</span>
              Adresse de livraison
            </h2>

            {addresses.length > 0 && !showNewAddressForm && (
              <div className="addresses-list">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`address-card ${selectedAddressId === address.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                    />
                    <div className="address-content">
                      <span className="address-name">{address.fullName}</span>
                      <span className="address-detail">{address.street}</span>
                      <span className="address-detail">{address.city}</span>
                      <span className="address-phone">{address.phone}</span>
                    </div>
                    <div className="check-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                ))}

                <button
                  className="btn-add-address"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Ajouter une nouvelle adresse
                </button>
              </div>
            )}

            {showNewAddressForm && (
              <form className="address-form" onSubmit={handleCreateAddress}>
                <div className="form-group">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    name="fullName"
                    value={newAddress.fullName}
                    onChange={handleNewAddressChange}
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleNewAddressChange}
                    placeholder="06 00 00 00 00"
                  />
                </div>

                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    name="street"
                    value={newAddress.street}
                    onChange={handleNewAddressChange}
                    placeholder="Rue, numéro, appartement..."
                  />
                </div>

                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    placeholder="Votre ville"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    Enregistrer l'adresse
                  </button>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowNewAddressForm(false)}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="section-title">
              <span className="step-number">2</span>
              Récapitulatif
            </h2>

            <div className="summary-card">
              <div className="summary-items">
                {items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-image">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product?.name} />
                      ) : (
                        <div className="image-placeholder"></div>
                      )}
                    </div>
                    <div className="item-info">
                      <span className="item-name">{item.product?.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                    <span className="item-price">
                      {(item.product?.price * item.quantity).toFixed(2)} DH
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Sous-total ({count} articles)</span>
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

              <button
                className="btn-order"
                onClick={handleSubmitOrder}
                disabled={submitting || !selectedAddressId}
              >
                {submitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    Confirmer la commande
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>

              <div className="secure-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Paiement sécurisé
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
  .checkout-page {
    margin-top: 80px;
    min-height: calc(100vh - 80px);
    background: #FAF7F2;
    padding: 40px 0 80px;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .page-header {
    margin-bottom: 40px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #6B7280;
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 16px;
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: #000;
  }

  .back-link svg {
    width: 18px;
    height: 18px;
  }

  .page-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 32px;
    font-weight: 700;
  }

  .alert-error {
    padding: 16px 20px;
    background: #FEE2E2;
    color: #991B1B;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .checkout-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 40px;
    align-items: start;
  }

  .checkout-section {
    background: #fff;
    border-radius: 20px;
    padding: 32px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border-radius: 50%;
  }

  /* Addresses */
  .addresses-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .address-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .address-card:hover {
    border-color: #D4AF37;
  }

  .address-card.selected {
    border-color: #D4AF37;
    background: #FFFBEB;
  }

  .address-card input[type="radio"] {
    display: none;
  }

  .address-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .address-name {
    font-weight: 600;
  }

  .address-detail {
    font-size: 14px;
    color: #6B7280;
  }

  .address-phone {
    font-size: 14px;
    color: #9CA3AF;
    margin-top: 4px;
  }

  .check-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #E5E7EB;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .check-icon svg {
    width: 14px;
    height: 14px;
    opacity: 0;
    color: #fff;
  }

  .address-card.selected .check-icon {
    background: #D4AF37;
    border-color: #D4AF37;
  }

  .address-card.selected .check-icon svg {
    opacity: 1;
  }

  .btn-add-address {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    border: 2px dashed #E5E7EB;
    border-radius: 12px;
    background: transparent;
    color: #6B7280;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-add-address:hover {
    border-color: #D4AF37;
    color: #D4AF37;
  }

  .btn-add-address svg {
    width: 20px;
    height: 20px;
  }

  /* Address Form */
  .address-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .form-group input {
    padding: 14px 16px;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.2s ease;
  }

  .form-group input:focus {
    outline: none;
    border-color: #D4AF37;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .btn-save {
    flex: 1;
    padding: 14px 24px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-save:hover {
    background: #D4AF37;
  }

  .btn-cancel {
    padding: 14px 24px;
    background: transparent;
    color: #6B7280;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cancel:hover {
    background: #F3F4F6;
  }

  /* Order Summary */
  .order-summary {
    position: sticky;
    top: 120px;
  }

  .summary-card {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
  }

  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .summary-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .summary-item .item-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    background: #FAF7F2;
  }

  .summary-item .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .summary-item .image-placeholder {
    width: 100%;
    height: 100%;
    background: #E5E7EB;
  }

  .summary-item .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .summary-item .item-name {
    font-size: 14px;
    font-weight: 500;
  }

  .summary-item .item-qty {
    font-size: 13px;
    color: #9CA3AF;
  }

  .summary-item .item-price {
    font-weight: 600;
    color: #D4AF37;
  }

  .summary-divider {
    height: 1px;
    background: #E5E7EB;
    margin: 16px 0;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 12px;
  }

  .summary-row .free {
    color: #16A34A;
    font-weight: 500;
  }

  .summary-row.total {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .summary-row.total span:last-child {
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #D4AF37;
  }

  .btn-order {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-order:hover:not(:disabled) {
    background: #D4AF37;
    transform: translateY(-2px);
  }

  .btn-order:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-order svg {
    width: 20px;
    height: 20px;
  }

  .btn-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .secure-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #E5E7EB;
    font-size: 13px;
    color: #6B7280;
  }

  .secure-badge svg {
    width: 18px;
    height: 18px;
    color: #16A34A;
  }

  /* Loading & Success States */
  .loading-state,
  .success-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
    background: #fff;
    border-radius: 20px;
    text-align: center;
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

  .success-icon svg {
    width: 80px;
    height: 80px;
    color: #16A34A;
    margin-bottom: 24px;
  }

  .success-state h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .success-state p {
    color: #6B7280;
  }

  .redirect-text {
    margin-top: 16px;
    font-size: 14px;
    color: #9CA3AF;
  }

  .empty-state h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .btn-primary {
    display: inline-block;
    padding: 16px 40px;
    background: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-primary:hover {
    background: #D4AF37;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .checkout-layout {
      grid-template-columns: 1fr;
    }

    .order-summary {
      position: static;
    }
  }

  @media (max-width: 600px) {
    .container {
      padding: 0 20px;
    }

    .checkout-section,
    .summary-card {
      padding: 20px;
    }
  }
`;
