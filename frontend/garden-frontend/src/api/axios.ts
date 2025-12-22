import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",

});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access"); // token correcto
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
