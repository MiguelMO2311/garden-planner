import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { FaLeaf, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
    const { logout } = useAuth();

    return (
        <header className="h-16 bg-green-600 text-white shadow flex items-center justify-between px-6">
            <Link to="/" className="text-lg font-bold flex items-center gap-2">
                <FaLeaf className="text-xl" />
                Garden Planner
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium">
                <Link to="/dashboard" className="hover:text-green-200 transition">Dashboard</Link>
                <Link to="/calendario" className="hover:text-green-200 transition flex items-center gap-1">
                    <FaCalendarAlt />
                    Calendario
                </Link>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                >
                    <FaSignOutAlt />
                    Cerrar sesión
                </button>
            </nav>
        </header>
    );
}
