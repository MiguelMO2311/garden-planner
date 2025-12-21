import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./types";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const stored = localStorage.getItem("user");
            if (!stored || stored === "undefined" || stored === "null") {
                return null;
            }
            return JSON.parse(stored);
        } catch {
            // Si el JSON está corrupto, lo limpiamos
            localStorage.removeItem("user");
            return null;
        }
    });

    const login = (access: string, refresh: string, userData: AuthUser) => {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
