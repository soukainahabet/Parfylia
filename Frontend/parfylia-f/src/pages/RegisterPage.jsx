import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../services/authService";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { level: 1, label: "Très faible", color: "#DC2626" },
      { level: 2, label: "Faible", color: "#F59E0B" },
      { level: 3, label: "Moyen", color: "#FBBF24" },
      { level: 4, label: "Fort", color: "#10B981" },
      { level: 5, label: "Très fort", color: "#059669" }
    ];

    return levels[Math.min(strength - 1, 4)] || { level: 0, label: "", color: "" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password || !name) {
        setError("Tous les champs sont requis");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères");
        setLoading(false);
        return;
      }

      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      if (!hasUppercase || !hasLowercase || !hasNumber) {
        setError("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre");
        setLoading(false);
        return;
      }

      const data = await registerRequest(email, password, name);

      if (data.token) {
        login(data.token);
        navigate("/");
      } else {
        setError("Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Register error:", err);

      let errorMessage = "Erreur lors de l'inscription. Veuillez réessayer.";

      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const validationErrors = err.response.data.errors
          .map(e => e.message)
          .join(". ");
        errorMessage = validationErrors;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      if (err.status === 409 || err.message?.includes("already exists")) {
        errorMessage = "Cet email est déjà utilisé. Veuillez utiliser un autre email.";
      } else if (err.status === 0 || err.message?.includes("Network Error")) {
        errorMessage = "Impossible de se connecter au serveur. Vérifiez que le backend est démarré.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <Link to="/" className="logo">
              <span className="logo-text">PARFYLIA</span>
              <span className="logo-subtitle">Haute Parfumerie</span>
            </Link>
            <div className="branding-text">
              <h2>Rejoignez-nous</h2>
              <p>Créez votre compte et accédez à une expérience parfumée unique avec des avantages exclusifs.</p>
            </div>
            <div className="benefits">
              <div className="benefit">
                <div className="benefit-icon">1</div>
                <div className="benefit-text">
                  <strong>Accès privilégié</strong>
                  <span>Découvrez nos nouvelles collections en avant-première</span>
                </div>
              </div>
              <div className="benefit">
                <div className="benefit-icon">2</div>
                <div className="benefit-text">
                  <strong>Offres exclusives</strong>
                  <span>Profitez de réductions réservées aux membres</span>
                </div>
              </div>
              <div className="benefit">
                <div className="benefit-icon">3</div>
                <div className="benefit-text">
                  <strong>Suivi personnalisé</strong>
                  <span>Retrouvez votre historique et vos favoris</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="form-container">
            <div className="form-header">
              <h1>Créer un compte</h1>
              <p>Rejoignez notre communauté de passionnés</p>
            </div>

            {error && (
              <div className="alert-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                  <input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 car., maj., min., chiffre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`strength-segment ${level <= passwordStrength.level ? 'active' : ''}`}
                          style={{ backgroundColor: level <= passwordStrength.level ? passwordStrength.color : '#E5E7EB' }}
                        />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmer votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                  {confirmPassword && password === confirmPassword && (
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Inscription en cours...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>
                Déjà un compte ?{" "}
                <Link to="/login">Se connecter</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: #FAF7F2;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 100vh;
        }

        @media (min-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .auth-branding {
          display: none;
          background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
          padding: 60px;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .auth-branding {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .auth-branding::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
        }

        .branding-content {
          position: relative;
          z-index: 1;
          max-width: 400px;
        }

        .logo {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          margin-bottom: 60px;
        }

        .logo-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 8px;
          color: #fff;
        }

        .logo-subtitle {
          font-size: 12px;
          letter-spacing: 4px;
          color: #D4AF37;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .branding-text h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 36px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px 0;
        }

        .branding-text p {
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 40px 0;
        }

        .benefits {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .benefit {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .benefit-icon {
          width: 32px;
          height: 32px;
          background: #D4AF37;
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .benefit-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .benefit-text strong {
          color: #fff;
          font-size: 15px;
        }

        .benefit-text span {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
        }

        .auth-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          padding-top: 100px;
        }

        @media (min-width: 1024px) {
          .auth-form-section {
            padding: 60px;
            padding-top: 60px;
          }
        }

        .form-container {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .form-header h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: 32px;
          font-weight: 600;
          color: #000;
          margin: 0 0 8px 0;
        }

        .form-header p {
          color: #6B7280;
          font-size: 16px;
          margin: 0;
        }

        .alert-error {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #FEE2E2;
          border: 1px solid #FECACA;
          border-radius: 12px;
          color: #991B1B;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .alert-error svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin-top: 2px;
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

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper svg {
          position: absolute;
          left: 16px;
          width: 20px;
          height: 20px;
          color: #9CA3AF;
        }

        .input-wrapper input {
          width: 100%;
          padding: 16px 48px;
          font-size: 16px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          background: #fff;
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }

        .input-wrapper input:disabled {
          background: #F9FAFB;
          cursor: not-allowed;
        }

        .toggle-password {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .toggle-password svg {
          position: static;
          width: 20px;
          height: 20px;
          color: #9CA3AF;
        }

        .toggle-password:hover svg {
          color: #6B7280;
        }

        .check-icon {
          position: absolute;
          right: 16px;
          width: 20px;
          height: 20px;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .strength-bar {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .strength-segment {
          height: 4px;
          flex: 1;
          border-radius: 2px;
          transition: background-color 0.2s;
        }

        .strength-label {
          font-size: 12px;
          font-weight: 600;
          min-width: 80px;
          text-align: right;
        }

        .btn-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 18px 32px;
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
          margin-top: 8px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-footer {
          text-align: center;
          margin-top: 32px;
        }

        .form-footer p {
          color: #6B7280;
          font-size: 14px;
          margin: 0;
        }

        .form-footer a {
          color: #D4AF37;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .form-footer a:hover {
          color: #B8972E;
        }
      `}</style>
    </div>
  );
}
