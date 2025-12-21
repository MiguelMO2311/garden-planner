// --- Manejo de tokens en localStorage ---
// (Esta parte NO usa React)

export const getAccessToken = (): string | null =>
    localStorage.getItem("access_token");

export const getRefreshToken = (): string | null =>
    localStorage.getItem("refresh_token");

export const setAccessToken = (token: string) =>
    localStorage.setItem("access_token", token);

export const setRefreshToken = (token: string) =>
    localStorage.setItem("refresh_token", token);

export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// --- Hook de React para acceder al contexto de autenticación ---

import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
