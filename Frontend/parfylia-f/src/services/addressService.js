import api from "../utils/axiosConfig";

/**
 * Récupérer toutes les adresses de l'utilisateur
 */
export const getAddresses = async () => {
  const response = await api.get("/address");
  return response.data;
};

/**
 * Récupérer une adresse par son ID
 */
export const getAddressById = async (id) => {
  const response = await api.get(`/address/${id}`);
  return response.data;
};

/**
 * Créer une nouvelle adresse
 */
export const createAddress = async (addressData) => {
  const response = await api.post("/address", addressData);
  return response.data;
};

/**
 * Mettre à jour une adresse
 */
export const updateAddress = async (id, addressData) => {
  const response = await api.put(`/address/${id}`, addressData);
  return response.data;
};

/**
 * Supprimer une adresse
 */
export const deleteAddress = async (id) => {
  await api.delete(`/address/${id}`);
};
