import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../layout/layout.css";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-dark bg-success px-3 d-flex justify-content-between align-items-center">

            {/* Logo */}
            <NavLink className="navbar-brand fw-bold" to="/dashboard">
                🌱 Garden Planner
            </NavLink>

            {/* Usuario */}
            {user && (
                <div className="d-flex align-items-center gap-3">

                    <span className="text-white fw-semibold">
                        {user.name}
                    </span>

                    <img
                        src={user.avatar || "https://i.pravatar.cc/100"}
                        className="nav-avatar"
                        alt="avatar"
                    />

                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={logout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
        </nav>
    );
}
