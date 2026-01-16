import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./layout.css";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

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

                {/* CULTIVOS */}
                <NavLink
                    to="/cultivos"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">🌾</span>
                    <span className="label">Cultivos</span>
                </NavLink>

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

                {/* SANITARIO */}
                <div className="sidebar-section-title">
                    Sanitario
                </div>

                <NavLink
                    to="/sanitario"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">🧪</span>
                    <span className="label">Panel sanitario</span>
                </NavLink>

                <NavLink
                    to="/sanitario/riesgos"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">⚠️</span>
                    <span className="label">Riesgos</span>
                </NavLink>

                <NavLink
                    to="/sanitario/alertas"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">🚨</span>
                    <span className="label">Alertas</span>
                </NavLink>

                <NavLink
                    to="/sanitario/sugerencias"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">💡</span>
                    <span className="label">Sugerencias</span>
                </NavLink>

                <NavLink
                    to="/sanitario/tratamientos"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span className="icon">💊</span>
                    <span className="label">Tratamientos</span>
                </NavLink>

            </nav>
        </aside>
    );
}
