import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./layout.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`san-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="san-sidebar-header">
        <h4 className="san-sidebar-title">🌱 Garden</h4>

        <button
          className="san-sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <nav className="san-sidebar-nav">
        <NavLink to="/parcelas" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">🌱</span>
          <span className="label">Parcelas</span>
        </NavLink>

        <NavLink to="/cultivos" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">🌾</span>
          <span className="label">Cultivos</span>
        </NavLink>

        <NavLink to="/tareas" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">📝</span>
          <span className="label">Tareas</span>
        </NavLink>

        <NavLink to="/calendario" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">📅</span>
          <span className="label">Calendario</span>
        </NavLink>

        <div className="san-sidebar-section-title">Sanitario</div>

        <NavLink to="/sanitario" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">🧪</span>
          <span className="label">Panel sanitario</span>
        </NavLink>

        <NavLink to="/sanitario/riesgos" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">⚠️</span>
          <span className="label">Riesgos</span>
        </NavLink>

        <NavLink to="/sanitario/alertas" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">🚨</span>
          <span className="label">Alertas</span>
        </NavLink>

        <NavLink to="/sanitario/sugerencias" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">💡</span>
          <span className="label">Sugerencias</span>
        </NavLink>

        <NavLink to="/sanitario/tratamientos" className={({ isActive }) => `san-sidebar-link ${isActive ? "active" : ""}`}>
          <span className="icon">💊</span>
          <span className="label">Tratamientos</span>
        </NavLink>
      </nav>
    </aside>
  );
}
