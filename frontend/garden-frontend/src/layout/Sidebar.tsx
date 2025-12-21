import "./layout.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="sidebar-container">
            <div className="p-4 border-bottom">
                <h4 className="fw-bold text-success">Garden Planner</h4>
            </div>

            <nav className="nav flex-column p-3">
                <NavLink className="nav-link text-dark mb-2" to="/parcelas">🌱 Parcelas</NavLink>
                <NavLink className="nav-link text-dark mb-2" to="/cultivos">🌾 Cultivos</NavLink>
                <NavLink className="nav-link text-dark mb-2" to="/tareas">📝 Tareas</NavLink>
                <NavLink className="nav-link text-dark mb-2" to="/calendario">📅 Calendario</NavLink>
            </nav>
        </div>
    );
}
