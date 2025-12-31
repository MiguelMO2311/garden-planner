import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import type { AuthUser } from "./types";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [loading, setLoading] = useState(true);

    // Cargar usuario desde token al refrescar
    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem("access_token");

            if (!storedToken) {
                setLoading(false);
                return;
            }

            setToken(storedToken);

            // Cargar usuario guardado si existe
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }

            try {
                const res = await api.get("/auth/me", {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });

                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            } catch {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // LOGIN
    const login = async (accessToken: string) => {
        localStorage.setItem("access_token", accessToken);
        setToken(accessToken);

        const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const realUser = res.data;

        localStorage.setItem("user", JSON.stringify(realUser));
        setUser(realUser);

        navigate("/dashboard");
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
