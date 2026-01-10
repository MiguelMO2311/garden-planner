import { NavLink } from "react-router-dom";
import "./cultivos.css";

export default function CultivosMainPage() {
    return (
        <div className="cultivos-bg">

            <h2 className="cultivos-title">Gestión de Cultivos</h2>

            <div className="cultivos-grid">

                {/* CARD 1 — Cultivos en Parcela */}
                <NavLink to="/cultivos-parcela" className="cultivo-card">
                    <h3>Cultivos en Parcela</h3>
                    <p>Gestiona los cultivos activos en tus parcelas.</p>
                </NavLink>

                {/* CARD 2 — Catálogo de Cultivos */}
                <NavLink to="/cultivos-tipo" className="cultivo-card">
                    <h3>Catálogo de Cultivos</h3>
                    <p>Consulta y administra el catálogo de cultivos disponibles.</p>
                </NavLink>

            </div>
        </div>
    );
}
