import api from "../utils/axiosConfig";

const PRODUCT_API = "/products";

// ============ LISTE DES PRODUITS ============

export const getAllProducts = () => api.get(PRODUCT_API);

export const getProductsPaginated = (page = 0, size = 12, sortBy = "name", direction = "asc") =>
  api.get(`${PRODUCT_API}/paginated`, {
    params: { page, size, sortBy, direction }
  });

// ============ RECHERCHE ============

export const searchProducts = (keyword) =>
  api.get(`${PRODUCT_API}/search?q=${encodeURIComponent(keyword)}`);

export const getProductsByBrand = (brand) =>
  api.get(`${PRODUCT_API}/brand/${encodeURIComponent(brand)}`);

export const getProductsByCategory = (category) =>
  api.get(`${PRODUCT_API}/category/${encodeURIComponent(category)}`);

// ============ DETAILS PRODUIT ============

export const getProductById = (id) => api.get(`${PRODUCT_API}/${id}`);

export const getProductFullDetails = (id) => api.get(`${PRODUCT_API}/${id}/full`);

// ============ REVIEWS ============

export const getProductReviews = (productId) =>
  api.get(`${PRODUCT_API}/${productId}/reviews`);

export const addProductReview = (productId, rating, comment) =>
  api.post(`${PRODUCT_API}/${productId}/reviews`, { rating, comment });

// ============ CATEGORIES ============

export const getAllCategories = () => api.get(`${PRODUCT_API}/categories`);












