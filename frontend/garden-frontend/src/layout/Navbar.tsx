import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../layout/layout.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const avatarUrl = user?.avatar
        ? (user.avatar.startsWith("http")
            ? user.avatar
            : `http://localhost:8000${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`)
        : "https://i.pravatar.cc/100";

    return (
        <nav className="navbar-modern shadow-sm">
            {/* IZQUIERDA */}
            <div className="navbar-left">
                <NavLink className="navbar-logo" to="/dashboard">
                    🌱 Garden Planner
                </NavLink>
            </div>

            {/* DERECHA */}
            {user && (
                <div className="navbar-right">

                    {/* Nombre (oculto en móvil) */}
                    <button
                        onClick={() => navigate("/account")}
                        className="navbar-username"
                    >
                        {user.name}
                    </button>

                    {/* Avatar */}
                    <div className="navbar-avatar-wrapper">
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            className="navbar-avatar"
                            onClick={() => setOpen(!open)}
                        />

                        {/* Dropdown */}
                        {open && (
                            <div className="navbar-dropdown">
                                <button
                                    onClick={() => navigate("/account")}
                                    className="dropdown-item"
                                >
                                    Mi cuenta
                                </button>

                                <button
                                    onClick={logout}
                                    className="dropdown-item logout"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Botón hamburguesa (solo móvil) */}
                    <button
                        className="navbar-burger"
                        onClick={() => navigate("/sidebar")}
                    >
                        ☰
                    </button>
                </div>
            )}
        </nav>
    );
}
