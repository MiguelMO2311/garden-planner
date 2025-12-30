import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Navbar() {
    const { logout, user } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm px-3">

            {/* Logo → Dashboard */}
            <NavLink className="navbar-brand fw-bold" to="/dashboard">
                🌱 Garden Planner
            </NavLink>

            {/* Botón hamburguesa */}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-label="Abrir menú de navegación"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Contenido */}
            <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav ms-auto">

                    <li className="nav-item">
                        <NavLink className="nav-link" to="/dashboard">
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link" to="/calendario">
                            Calendario
                        </NavLink>
                    </li>

                    {/* Usuario + Avatar + Dropdown */}
                    <li className="nav-item dropdown ms-3 d-flex align-items-center">

                        {/* Nombre del usuario */}
                        <span className="text-white me-2 fw-semibold">
                            {user?.name || user?.username || user?.email}
                        </span>

                        {/* Avatar */}
                        <img
                            src={user?.avatar || "https://i.pravatar.cc/100"}
                            className="nav-avatar dropdown-toggle"
                            data-bs-toggle="dropdown"
                            alt="avatar"
                        />

                        {/* Menú desplegable */}
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <NavLink className="dropdown-item" to="/perfil">
                                    Perfil
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="dropdown-item" to="/ajustes">
                                    Ajustes
                                </NavLink>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={logout}
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </li>

                </ul>
            </div>
        </nav>
    );
}
