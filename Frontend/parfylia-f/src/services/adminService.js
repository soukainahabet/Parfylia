import api from "../utils/axiosConfig";

// Utiliser l'instance axios globale avec interceptor JWT
const ADMIN_API = "/admin";

export const getUsers = () => api.get(`${ADMIN_API}/users`);
export const getUserById = (id) => api.get(`${ADMIN_API}/users/${id}`);
export const createUser = (userData) => api.post(`${ADMIN_API}/users`, userData);
export const updateUser = (id, userData) => api.put(`${ADMIN_API}/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`${ADMIN_API}/users/${id}`);
export const changeUserRole = (id, role) => api.put(`${ADMIN_API}/users/${id}/role`, null, { params: { role } });
export const addPermission = (id, permission) => api.post(`${ADMIN_API}/users/${id}/permissions`, null, { params: { permission } });
export const removePermission = (id, permission) => api.delete(`${ADMIN_API}/users/${id}/permissions`, { params: { permission } });
