import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();

    // 🔥 Mientras carga, no redirigimos
    if (loading) return null;

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};
