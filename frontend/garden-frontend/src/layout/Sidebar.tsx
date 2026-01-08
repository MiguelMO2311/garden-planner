import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./layout.css";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [openCultivos, setOpenCultivos] = useState(true);

    return (
        <aside className={`sidebar-modern ${collapsed ? "collapsed" : ""}`}>
            {/* HEADER */}
            <div className="sidebar-header">
                <h4 className="sidebar-title">🌱 Garden</h4>

                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? "›" : "‹"}
                </button>
            </div>

            {/* NAV */}
            <nav className="sidebar-nav">

                {/* PARCELAS */}
                <NavLink
                    to="/parcelas"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">🌱</span>
                    <span className="label">Parcelas</span>
                </NavLink>

                {/* SECCIÓN CULTIVOS */}
                <div className="sidebar-section">
                    <button
                        className="sidebar-section-toggle"
                        onClick={() => setOpenCultivos(!openCultivos)}
                    >
                        <span className="icon">🌾</span>
                        <span className="label">Cultivos</span>
                        <span className="arrow">{openCultivos ? "▾" : "▸"}</span>
                    </button>

                    {openCultivos && (
                        <div className="sidebar-submenu">
                            <NavLink
                                to="/cultivos-parcela"
                                className={({ isActive }) =>
                                    `sidebar-sublink ${isActive ? "active" : ""}`
                                }
                            >
                                Cultivos en parcela
                            </NavLink>

                            <NavLink
                                to="/cultivos-tipo"
                                className={({ isActive }) =>
                                    `sidebar-sublink ${isActive ? "active" : ""}`
                                }
                            >
                                Catálogo de cultivos
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* TAREAS */}
                <NavLink
                    to="/tareas"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">📝</span>
                    <span className="label">Tareas</span>
                </NavLink>

                {/* CALENDARIO */}
                <NavLink
                    to="/calendario"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">📅</span>
                    <span className="label">Calendario</span>
                </NavLink>

            </nav>
        </aside>
    );
}
