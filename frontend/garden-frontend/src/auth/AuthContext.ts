import { createContext } from "react";

export type AuthContextType = {
    isAuthenticated: boolean;
    login: (access: string, refresh: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
