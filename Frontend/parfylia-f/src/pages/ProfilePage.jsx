import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../utils/axiosConfig";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "../services/addressService";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    street: "",
    city: "",
    phone: ""
  });

  useEffect(() => {
    loadProfile();
    loadAddresses();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile");
      setProfile(response.data);
      setFormData({
        name: response.data.name || "",
        email: response.data.email || ""
      });
      setError(null);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error("Error loading addresses:", err);
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressForm);
      } else {
        await createAddress(addressForm);
      }
      await loadAddresses();
      resetAddressForm();
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Erreur lors de la sauvegarde de l'adresse");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName || "",
      street: address.street || "",
      city: address.city || "",
      phone: address.phone || ""
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Supprimer cette adresse ?")) {
      try {
        await deleteAddress(id);
        await loadAddresses();
      } catch (err) {
        console.error("Error deleting address:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const resetAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm({ fullName: "", street: "", city: "", phone: "" });
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
      setSaving(true);
      await api.put("/profile", formData);
      await loadProfile();
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement de votre profil...</p>
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

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <div className="error-icon">!</div>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={loadProfile} className="btn-retry">
            Réessayer
          </button>
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
            gap: 16px;
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

          .error-state p {
            color: #6B7280;
            margin: 0;
          }

          .btn-retry {
            padding: 14px 32px;
            background: #000;
            color: #fff;
            border: none;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-retry:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mon Profil</h1>
        <p className="subtitle">Gérez vos informations personnelles</p>
      </div>

      <div className="profile-grid">
        {/* Profile Section */}
        <section className="profile-card">
          <div className="card-header">
            <div className="avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <div className="header-info">
              <h2>{profile?.name || "Utilisateur"}</h2>
              <span className="role-badge">
                {profile?.roles?.join(", ") || user?.role || "Membre"}
              </span>
            </div>
          </div>

          <div className="card-content">
            {!editing ? (
              <>
                <div className="info-group">
                  <label>Nom</label>
                  <p>{profile?.name || "-"}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{profile?.email || "-"}</p>
                </div>
                <button className="btn-edit" onClick={() => setEditing(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Modifier le profil
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Addresses Section */}
        <section className="addresses-section">
          <div className="section-header">
            <h2>Mes Adresses</h2>
            {!showAddressForm && (
              <button className="btn-add" onClick={() => setShowAddressForm(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Ajouter
              </button>
            )}
          </div>

          {showAddressForm && (
            <div className="address-form-card">
              <h3>{editingAddress ? "Modifier l'adresse" : "Nouvelle adresse"}</h3>
              <form onSubmit={handleAddressSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Nom complet</label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Nom complet"
                      value={addressForm.fullName}
                      onChange={handleAddressChange}
                      required
                      disabled={savingAddress}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Téléphone</label>
                    <input
                      id="phone"
                      type="text"
                      name="phone"
                      placeholder="Téléphone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      required
                      disabled={savingAddress}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="street">Rue</label>
                  <input
                    id="street"
                    type="text"
                    name="street"
                    placeholder="Adresse complète"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                    required
                    disabled={savingAddress}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Ville</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Ville"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    required
                    disabled={savingAddress}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={savingAddress}>
                    {savingAddress ? "Sauvegarde..." : (editingAddress ? "Modifier" : "Ajouter")}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={resetAddressForm}
                    disabled={savingAddress}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {addresses.length === 0 && !showAddressForm ? (
            <div className="empty-addresses">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p>Aucune adresse enregistrée</p>
            </div>
          ) : (
            <div className="addresses-list">
              {addresses.map((addr) => (
                <div key={addr.id} className="address-card">
                  <div className="address-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="address-details">
                    <strong>{addr.fullName}</strong>
                    <span>{addr.street}</span>
                    <span>{addr.city}</span>
                    <span className="phone">{addr.phone}</span>
                  </div>
                  <div className="address-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEditAddress(addr)}
                      title="Modifier"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteAddress(addr.id)}
                      title="Supprimer"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Logout Button */}
      <div className="logout-section">
        <button className="btn-logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </button>
      </div>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
          max-width: 900px;
          margin: 0 auto;
          padding-left: 40px;
          padding-right: 40px;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: 36px;
          font-weight: 600;
          color: #000;
          margin: 0 0 8px 0;
        }

        .subtitle {
          color: #6B7280;
          font-size: 16px;
          margin: 0;
        }

        .profile-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .profile-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 32px;
          background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
        }

        .avatar {
          width: 72px;
          height: 72px;
          background: #D4AF37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar svg {
          width: 36px;
          height: 36px;
          color: #000;
        }

        .header-info h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(212, 175, 55, 0.2);
          color: #D4AF37;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-content {
          padding: 32px;
        }

        .info-group {
          margin-bottom: 20px;
        }

        .info-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .info-group p {
          font-size: 16px;
          color: #1F2937;
          margin: 0;
        }

        .btn-edit {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #FAF7F2;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 24px;
        }

        .btn-edit:hover {
          background: #F3F4F6;
        }

        .btn-edit svg {
          width: 18px;
          height: 18px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          font-size: 16px;
          border: 2px solid #E5E7EB;
          border-radius: 10px;
          background: #fff;
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }

        .form-group input:disabled {
          background: #F9FAFB;
          cursor: not-allowed;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-save {
          padding: 14px 28px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 14px 28px;
          background: transparent;
          color: #6B7280;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #F3F4F6;
        }

        .addresses-section {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #000;
          margin: 0;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-add svg {
          width: 16px;
          height: 16px;
        }

        .address-form-card {
          background: #FAF7F2;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .address-form-card h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin: 0 0 20px 0;
        }

        .empty-addresses {
          text-align: center;
          padding: 48px 24px;
          color: #9CA3AF;
        }

        .empty-addresses svg {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-addresses p {
          font-size: 14px;
          margin: 0;
        }

        .addresses-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .address-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: #FAF7F2;
          border-radius: 16px;
          transition: all 0.2s;
        }

        .address-card:hover {
          background: #F3F4F6;
        }

        .address-icon {
          width: 44px;
          height: 44px;
          background: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .address-icon svg {
          width: 22px;
          height: 22px;
          color: #D4AF37;
        }

        .address-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .address-details strong {
          font-size: 15px;
          color: #1F2937;
        }

        .address-details span {
          font-size: 14px;
          color: #6B7280;
        }

        .address-details .phone {
          color: #D4AF37;
          font-weight: 500;
        }

        .address-actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon svg {
          width: 18px;
          height: 18px;
        }

        .btn-icon.edit {
          background: #fff;
          color: #6B7280;
        }

        .btn-icon.edit:hover {
          color: #D4AF37;
        }

        .btn-icon.delete {
          background: #fff;
          color: #6B7280;
        }

        .btn-icon.delete:hover {
          background: #FEE2E2;
          color: #DC2626;
        }

        .logout-section {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid #E5E7EB;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: transparent;
          color: #DC2626;
          border: 2px solid #DC2626;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-logout:hover {
          background: #DC2626;
          color: #fff;
        }

        .btn-logout svg {
          width: 20px;
          height: 20px;
        }

        @media (max-width: 640px) {
          .page-container {
            padding-left: 20px;
            padding-right: 20px;
          }

          .page-header h1 {
            font-size: 28px;
          }

          .card-header {
            flex-direction: column;
            text-align: center;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .btn-add {
            width: 100%;
            justify-content: center;
          }

          .address-card {
            flex-direction: column;
          }

          .address-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
