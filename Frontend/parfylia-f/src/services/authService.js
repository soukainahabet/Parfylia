import axios from "axios";

const API_URL = "http://localhost:8081/api/auth";

// Instance axios pour les requêtes d'authentification (sans token)
const authAPI = axios.create({
  baseURL: API_URL,
});

/**
 * Inscription d'un nouvel utilisateur
 */
export const registerRequest = async (email, password, name) => {
  try {
    const res = await authAPI.post("/register", {
      email,
      password,
      name,
    });
    return res.data;
  } catch (error) {
    // Améliorer la gestion d'erreur
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || errorData?.error || error.message || "Erreur lors de l'inscription";
    
    // Créer un objet d'erreur avec plus d'informations
    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = error.response?.status;
    customError.data = errorData;
    
    throw customError;
  }
};

/**
 * Connexion d'un utilisateur
 */
export const loginRequest = async (email, password) => {
  try {
    const res = await authAPI.post("/login", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
