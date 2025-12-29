import { useState } from "react";
import { AuthContext } from "./authContext";
import type { AuthUser } from "./types";
import { useNavigate } from "react-router-dom";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    // Inicializar usuario desde localStorage
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const stored = localStorage.getItem("user");
            if (!stored || stored === "undefined" || stored === "null") return null;
            return JSON.parse(stored);
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const [loading] = useState(false);

    // LOGIN CORRECTO PARA FASTAPI
    const login = (accessToken: string, userData: AuthUser) => {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        navigate("/parcelas");
    };

    // LOGOUT CORRECTO
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
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
