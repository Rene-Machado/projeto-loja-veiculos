import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // URL do seu backend Spring Boot
});

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Garantir que o header Authorization é adicionado mesmo para FormData
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
