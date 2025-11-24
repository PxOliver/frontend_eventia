// src/api/authService.js
import axios from "axios";
import { API_BASE_URL } from "./config";

const API_URL = API_BASE_URL;

export const register = async (data) => {
  return await axios.post(`${API_URL}/auth/register`, data);
};

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  if (!res.data?.token) {
    throw new Error("Token no recibido desde el backend");
  }

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("rol", res.data.rol || "");
  localStorage.setItem("nombre", res.data.nombre || "");
  localStorage.setItem("usuario_id", res.data.id || "");

  return res.data;
};

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("nombre");
  localStorage.removeItem("usuario_id");
};

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");

  if (!token) return false;
  if (token === "undefined") return false;
  if (token === "null") return false;
  if (token.trim() === "") return false;

  return true;
};