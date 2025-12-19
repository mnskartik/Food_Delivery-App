import api from "./axiosConfig";

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const signup = (data) => api.post("/auth/signup", data);
