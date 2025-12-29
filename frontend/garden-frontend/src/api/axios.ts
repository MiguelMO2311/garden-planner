import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
});

// Interceptor para añadir el token en TODAS las peticiones
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Token correcto según tu backend FastAPI
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
