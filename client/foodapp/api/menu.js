import api from "./axiosConfig";

export const getCategories = () => api.get("/menu/categories");

export const getItemsByCategory = (id) =>
  api.get(`/menu/category/${id}`);
