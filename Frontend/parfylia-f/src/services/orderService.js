import api from "../utils/axiosConfig";

const ORDER_API = "/orders";

export const getOrders = () => api.get(ORDER_API);
export const getOrderById = (id) => api.get(`${ORDER_API}/${id}`);
export const createOrder = (orderData) => api.post(ORDER_API, orderData);
export const updateOrderStatus = (id, status) => api.put(`${ORDER_API}/${id}/status`, null, { params: { status } });
export const cancelOrder = (id) => api.put(`${ORDER_API}/${id}/cancel`);
export const deleteOrder = (id) => api.delete(`${ORDER_API}/${id}`);











