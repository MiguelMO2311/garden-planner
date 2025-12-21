import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const linkClass =
        "block px-4 py-2 rounded hover:bg-blue-100 transition text-gray-700";

    const activeClass =
        "block px-4 py-2 rounded bg-blue-600 text-white transition";

    return (
        <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 p-4">
            <h2 className="text-xl font-bold mb-6">Garden Planner</h2>

            <nav className="space-y-2">
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? activeClass : linkClass)}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/parcelas"
                    className={({ isActive }) => (isActive ? activeClass : linkClass)}
                >
                    Parcelas
                </NavLink>

                <NavLink
                    to="/calendario"
                    className={({ isActive }) => (isActive ? activeClass : linkClass)}
                >
                    Calendario
                </NavLink>

                <NavLink
                    to="/ajustes"
                    className={({ isActive }) => (isActive ? activeClass : linkClass)}
                >
                    Ajustes
                </NavLink>
            </nav>
        </aside>
    );
}
