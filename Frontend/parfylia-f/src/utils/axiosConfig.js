import axios from "axios";

// Instance axios globale avec interceptor pour ajouter le token JWT
const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

// Interceptor pour ajouter automatiquement le token JWT à toutes les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les erreurs de réponse (401, 403, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;











