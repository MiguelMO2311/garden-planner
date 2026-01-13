import { NavLink } from "react-router-dom";
import "./cultivos.css";

export default function CultivosMainPage() {
    return (
        <div className="cultivos-bg">

            <div className="cultivos-card mb-4 dashboard-page-header dashboard-card-cultivos">
                <h2 className="cultivos-title">Gestión de Cultivos</h2>
            </div>

            <div className="cultivos-grid">

                {/* CARD 1 — Cultivos en Parcela */}
                <NavLink to="/cultivos-parcela" className="cultivo-card cultivo-card-animated">
                    <div className="cultivo-icon">
                        {/* Heroicon: Sprout */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="icon-svg">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 21c0-4.97-4.03-9-9-9h0a9 9 0 019-9h0a9 9 0 019 9h0c-4.97 0-9 4.03-9 9z" />
                        </svg>
                    </div>
                    <h3>Cultivos en Parcela</h3>
                    <p>Gestiona los cultivos activos en tus parcelas.</p>
                </NavLink>

                {/* CARD 2 — Catálogo de Cultivos */}
                <NavLink to="/cultivos-tipo" className="cultivo-card cultivo-card-animated">
                    <div className="cultivo-icon">
                        {/* Heroicon: Book Open */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="icon-svg">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 6.75c-2.485-1.5-5.515-1.5-8 0v10.5c2.485-1.5 5.515-1.5 8 0m0-10.5c2.485-1.5 5.515-1.5 8 0v10.5c-2.485-1.5-5.515-1.5-8 0m0-10.5v10.5" />
                        </svg>
                    </div>
                    <h3>Catálogo de Cultivos</h3>
                    <p>Consulta y administra el catálogo de cultivos disponibles.</p>
                </NavLink>

                {/* CARD 3 — Recomendaciones Inteligentes */}
                <NavLink to="/recomendaciones" className="cultivo-card cultivo-card-animated">
                    <div className="cultivo-icon">
                        {/* Heroicon: Sparkles */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="icon-svg">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 3v2.25M12 18.75V21M4.5 12H6.75M17.25 12H19.5M7.5 7.5l1.5 1.5M15 15l1.5 1.5M7.5 16.5L9 15M15 9l1.5-1.5" />
                        </svg>
                    </div>
                    <h3>Recomendaciones</h3>
                    <p>Consejos automáticos basados en clima y estado del cultivo.</p>
                </NavLink>

            </div>
        </div>
    );
}
