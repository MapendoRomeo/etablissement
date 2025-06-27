// src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-etablissement.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // pour les cookies si tu utilises les sessions https://backend-etablissement.onrender.com
});

// Ajout automatique du token dans chaque requête
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;





