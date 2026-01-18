import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../layout/layout.css";

export default function SanNavbar() {
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
    <nav className="san-navbar">
      <div className="san-navbar-left">
        <NavLink className="san-navbar-logo" to="/dashboard">
          🌱 Garden Planner
        </NavLink>
      </div>

      {user && (
        <div className="san-navbar-right">

          <button
            onClick={() => navigate("/account")}
            className="san-navbar-username"
          >
            {user.name}
          </button>

          <div className="san-navbar-avatar-wrapper" ref={dropdownRef}>
            <img
              src={avatarUrl}
              alt="avatar"
              className="san-navbar-avatar"
              onClick={() => setOpenDropdown(!openDropdown)}
            />

            {openDropdown && (
              <div className="san-navbar-dropdown">
                <button
                  onClick={() => {
                    setOpenDropdown(false);
                    navigate("/account");
                  }}
                  className="san-dropdown-item"
                >
                  Mi cuenta
                </button>

                <button
                  onClick={() => {
                    setOpenDropdown(false);
                    logout();
                  }}
                  className="san-dropdown-item logout"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

          <button
            className="san-navbar-burger"
            onClick={() => setOpenMobile(!openMobile)}
          >
            ☰
          </button>

          {openMobile && (
            <div className="san-mobile-menu" ref={mobileRef}>
              <button className="san-mobile-item" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>

              <button className="san-mobile-item" onClick={() => navigate("/parcelas")}>
                Parcelas
              </button>

              <button className="san-mobile-item" onClick={() => navigate("/sanitario")}>
                Sanitario
              </button>

              <button className="san-mobile-item" onClick={() => navigate("/account")}>
                Mi cuenta
              </button>

              <button className="san-mobile-item logout" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
