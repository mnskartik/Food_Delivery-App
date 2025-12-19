import api from "./axiosConfig";

export const placeOrder = (items, total) =>
  api.post("/orders", { items, total });

export const getOrderHistory = () => api.get("/orders/history");

export const getOrderStatus = (id) =>
  api.get(`/orders/${id}/status`);
