import api from "../utils/axiosConfig";

const CART_API = "/cart";

// Récupérer le panier complet
export const getCart = () => api.get(CART_API);

// Résumé du panier (nombre d'items + total)
export const getCartSummary = () => api.get(`${CART_API}/summary`);

// Ajouter un produit au panier
export const addToCart = (productId, quantity = 1) =>
  api.post(`${CART_API}/items`, { productId, quantity });

// Modifier la quantité d'un item
export const updateCartItem = (itemId, quantity) =>
  api.put(`${CART_API}/items/${itemId}`, { quantity });

// Supprimer un item du panier
export const removeFromCart = (itemId) =>
  api.delete(`${CART_API}/items/${itemId}`);

// Vider le panier
export const clearCart = () => api.delete(CART_API);











