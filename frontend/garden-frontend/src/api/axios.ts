import axios from "axios";
import { getAccessToken } from "../auth/useAuth";

const api = axios.create({
    baseURL: "http://localhost:8000",
});

// Añadir token a cada petición
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Manejo de errores sin refresh tokens
api.interceptors.response.use(
    (res) => res,
    (error) => {
        // Si el token no es válido → logout en el frontend
        if (error.response?.status === 401) {
            console.warn("Token inválido o expirado");
        }
        return Promise.reject(error);
    }
);

export default api;
