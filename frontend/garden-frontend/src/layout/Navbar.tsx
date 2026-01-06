import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../layout/layout.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const avatarUrl = user?.avatar
        ? (user.avatar.startsWith("http")
            ? user.avatar
            : `http://localhost:8000${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`)
        : "https://i.pravatar.cc/100";
    return (
        <nav className="navbar navbar-dark bg-success px-3 d-flex justify-content-between align-items-center">

            <NavLink className="navbar-brand fw-bold" to="/dashboard">
                🌱 Garden Planner
            </NavLink>

            {user && (
                <div className="d-flex align-items-center gap-3">

                    {/* 🔥 Nombre clicable → /account */}
                    <button
                        onClick={() => navigate("/account")}
                        className="text-white fw-semibold bg-transparent border-0 p-0"
                        style={{ cursor: "pointer" }}
                    >
                        {user.name}
                    </button>

                    <img
                        src={avatarUrl}
                        className="nav-avatar"
                        alt="avatar"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/account")}
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
