const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getAvatar = (avatar: string | null | undefined) => {
    if (!avatar) {
        return `${API_URL}/static/avatars/default.png`;
    }

    // Si el backend devuelve una ruta relativa (ej: "static/avatars/user1.png")
    if (!avatar.startsWith("http")) {
        return `${API_URL}/${avatar}`;
    }

    return avatar;
};
