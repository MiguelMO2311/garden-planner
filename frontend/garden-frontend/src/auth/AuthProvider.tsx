import { useState } from "react";
import { AuthContext } from "./authContext";
import type { AuthUser } from "./types";
import { useNavigate } from "react-router-dom";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    // 1️⃣ Inicializamos el usuario directamente, sin useEffect
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

    // 2️⃣ login
    const login = (access: string, refresh: string, userData: AuthUser) => {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        navigate("/parcelas");
    };

    // 3️⃣ logout
    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
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
