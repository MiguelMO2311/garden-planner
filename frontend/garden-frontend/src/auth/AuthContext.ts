import { createContext } from "react";
import type { AuthUser } from "./types";

export type AuthContextType = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (accessToken: string, user: AuthUser) => void;
    logout: () => void;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
