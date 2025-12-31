import { createContext } from "react";
import type { AuthUser } from "./types";

export type AuthContextType = {
    user: AuthUser | null;
    token: string | null;                     // 👈 AÑADIDO
    isAuthenticated: boolean;
    login: (accessToken: string) => void;
    logout: () => void;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
