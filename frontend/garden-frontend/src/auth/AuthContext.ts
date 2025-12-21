import { createContext } from "react";
import type { AuthUser } from "./types";

export type AuthContextType = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (access: string, refresh: string, user: AuthUser) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
