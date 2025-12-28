import { useState } from "react";

export default function TestLoginPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setStatus("Connexion en cours...");

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "superadmin@parfylia.com",
          password: "Admin123!"
        })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setStatus("Connexion réussie! Redirection...");
        setTimeout(() => {
          window.location.href = "/admin/users";
        }, 1000);
      } else {
        setStatus("Erreur: " + (data.message || "Pas de token"));
      }
    } catch (e) {
      setStatus("Erreur: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: "100px 50px",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      background: "#f5f5f5",
      minHeight: "100vh"
    }}>
      <h1 style={{ marginBottom: "30px" }}>Connexion Admin</h1>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: "15px 40px",
          fontSize: "18px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? "Connexion..." : "Se connecter en tant qu'Admin"}
      </button>

      {status && (
        <div style={{
          padding: "20px",
          margin: "30px auto",
          maxWidth: "400px",
          borderRadius: "10px",
          background: status.includes("Erreur") ? "#f8d7da" : "#d4edda",
          color: status.includes("Erreur") ? "#721c24" : "#155724"
        }}>
          {status}
        </div>
      )}

      <p style={{ marginTop: "40px", color: "#666" }}>
        Email: superadmin@parfylia.com<br/>
        Password: Admin123!
      </p>
    </div>
  );
}
