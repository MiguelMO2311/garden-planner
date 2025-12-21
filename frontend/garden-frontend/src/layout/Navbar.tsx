import { useAuth } from "../auth/useAuth";

export default function Navbar() {
    const { logout } = useAuth();

    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold">Dashboard</h1>

            <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Cerrar sesión
            </button>
        </header>
    );
}
