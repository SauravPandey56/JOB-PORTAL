import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (d?.message) return d.message;
  if (Array.isArray(d?.errors) && d.errors[0]?.msg) return d.errors[0].msg;
  return err?.message || "Something went wrong. Please try again.";
}
