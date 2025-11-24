import axios from "axios";
import { API_BASE_URL } from "./config";

// =========================
//  REGISTRO
// =========================
export const register = async (data) => {
  return axios.post(`${API_BASE_URL}/auth/register`, data);
};

// =========================
//  LOGIN
// =========================
export const login = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });

  // Validación de seguridad
  if (!res.data?.token) {
    throw new Error("Token no recibido desde el backend");
  }

  // Guardar token y datos del usuario
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("rol", res.data.rol || "");
  localStorage.setItem("nombre", res.data.nombre || "");
  localStorage.setItem("usuario_id", res.data.id || "");

  return res.data;
};

// =========================
//  HEADER DE AUTORIZACIÓN
// =========================
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
};

// =========================
//  LOGOUT
// =========================
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("nombre");
  localStorage.removeItem("usuario_id");
};

// =========================
//  ESTADO DE LOGIN
// =========================
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");

  if (!token) return false;
  if (token === "undefined") return false;
  if (token === "null") return false;
  if (token.trim() === "") return false;

  return true;
};