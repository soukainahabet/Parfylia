import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        console.error("Token invalide:", e);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      return decoded;
    } catch (e) {
      console.error("Erreur lors du décodage du token:", e);
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Helper pour vérifier si l'utilisateur est admin
  const isAdmin = () => {
    if (!user) return false;
    const role = user.role || user.roles || user.authorities;
    if (typeof role === "string") {
      return role.includes("ADMIN") || role.includes("ROLE_ADMIN");
    }
    return false;
  };

  // Helper pour vérifier les permissions
  const hasPermission = (permission) => {
    if (!user) return false;
    const permissions = user.permissions || user.authorities || [];
    if (typeof permissions === "string") {
      return permissions.includes(permission);
    }
    if (Array.isArray(permissions)) {
      return permissions.includes(permission);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin: isAdmin(),
      hasPermission,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
