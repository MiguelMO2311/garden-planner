import axios from "axios";
import { getAccessToken, getRefreshToken, setAccessToken } from "../auth/useAuth";

const api = axios.create({
    baseURL: "http://localhost:8000",
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const refresh = getRefreshToken();
            if (!refresh) return Promise.reject(error);

            try {
                const { data } = await axios.post("http://localhost:8000/auth/refresh", {
                    refresh_token: refresh,
                });

                setAccessToken(data.access_token);
                original.headers.Authorization = `Bearer ${data.access_token}`;

                return api(original);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
