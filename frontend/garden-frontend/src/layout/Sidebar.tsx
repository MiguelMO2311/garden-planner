import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaSeedling, FaCalendarAlt, FaCog } from "react-icons/fa";

export default function Sidebar() {
    const linkClass =
        "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100 transition";

    const activeClass =
        "flex items-center gap-3 px-4 py-2 rounded-lg bg-green-600 text-white transition";

    return (
        <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 p-6 border-r border-gray-200">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-green-700">
                🌱 Garden Planner
            </h2>

            <nav className="space-y-3">
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? activeClass : linkClass)}
                >
                    <FaTachometerAlt />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/parcelas"
                    className={({ isActive }) => (isActive ? activeClass : linkClass)}
                >
                    <FaSeedling />
                    Parcelas
                </NavLink>

                <NavLink
                    to="/calendario"
                    className={({ isActive }) => (isActive ? activeClass : linkClass)}
                >
                    <FaCalendarAlt />
                    Calendario
                </NavLink>

                <NavLink
                    to="/ajustes"
                    className={({ isActive }) => (isActive ? activeClass : linkClass)}
                >
                    <FaCog />
                    Ajustes
                </NavLink>
            </nav>
        </aside>
    );
}
