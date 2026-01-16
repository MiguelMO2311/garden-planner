import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../layout/layout.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [openDropdown, setOpenDropdown] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileRef = useRef<HTMLDivElement>(null);

    const avatarUrl = user?.avatar
        ? (user.avatar.startsWith("http")
            ? user.avatar
            : `http://localhost:8000${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`)
        : "https://i.pravatar.cc/100";

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setOpenDropdown(false);
            }

            if (mobileRef.current && !mobileRef.current.contains(target)) {
                setOpenMobile(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="navbar-modern shadow-sm">
            <div className="navbar-left">
                <NavLink className="navbar-logo" to="/dashboard">
                    🌱 Garden Planner
                </NavLink>
            </div>

            {user && (
                <div className="navbar-right">

                    <button
                        onClick={() => navigate("/account")}
                        className="navbar-username"
                    >
                        {user.name}
                    </button>

                    <div className="navbar-avatar-wrapper" ref={dropdownRef}>
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            className="navbar-avatar"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        />

                        {openDropdown && (
                            <div className="navbar-dropdown">
                                <button
                                    onClick={() => {
                                        setOpenDropdown(false);
                                        navigate("/account");
                                    }}
                                    className="dropdown-item"
                                >
                                    Mi cuenta
                                </button>

                                <button
                                    onClick={() => {
                                        setOpenDropdown(false);
                                        logout();
                                    }}
                                    className="dropdown-item logout"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        className="navbar-burger"
                        onClick={() => setOpenMobile(!openMobile)}
                    >
                        ☰
                    </button>

                    {openMobile && (
                        <div className="mobile-menu" ref={mobileRef}>
                            <button
                                className="mobile-item"
                                onClick={() => {
                                    setOpenMobile(false);
                                    navigate("/dashboard");
                                }}
                            >
                                Dashboard
                            </button>

                            <button
                                className="mobile-item"
                                onClick={() => {
                                    setOpenMobile(false);
                                    navigate("/plots");
                                }}
                            >
                                Parcelas
                            </button>

                            <button
                                className="mobile-item"
                                onClick={() => {
                                    setOpenMobile(false);
                                    navigate("/sanitario");
                                }}
                            >
                                Sanitario
                            </button>

                            <button
                                className="mobile-item"
                                onClick={() => {
                                    setOpenMobile(false);
                                    navigate("/account");
                                }}
                            >
                                Mi cuenta
                            </button>

                            <button
                                className="mobile-item logout"
                                onClick={() => {
                                    setOpenMobile(false);
                                    logout();
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
