import { useEffect, useState } from "react";
import { getPanelSanitario } from "../api/panelSanitarioApi";
import type { ParcelaSanitariaPanelItem } from "../types";
import { Link } from "react-router-dom";

export default function DashboardSanitarioCard() {
  const [items, setItems] = useState<ParcelaSanitariaPanelItem[]>([]);

  useEffect(() => {
    getPanelSanitario().then(setItems);
  }, []);

 const totalAlertas = items.reduce(
  (acc, p) =>
    acc +
    p.alertas.pendientes +
    p.alertas.confirmadas +
    p.alertas.descartadas,
  0
);

const totalPlagas = items.reduce(
  (acc, p) => acc + p.plagas.activas + p.plagas.historial,
  0
);

const totalEnfermedades = items.reduce(
  (acc, p) => acc + p.enfermedades.activas + p.enfermedades.historial,
  0
);

  return (
    <div className="san-card san-dashboard">
      <div className="san-dashboard-header">
        <h3 className="san-dashboard-title">Sanidad Agrícola</h3>
        <p className="san-dashboard-subtitle">
          Estado general de tus cultivos
        </p>
      </div>

      <div className="san-dashboard-grid">
        <div className="san-dashboard-item">
          <span className="san-dashboard-number">{totalAlertas}</span>
          <span className="san-dashboard-label">Alertas</span>
        </div>

        <div className="san-dashboard-item">
          <span className="san-dashboard-number">{totalPlagas}</span>
          <span className="san-dashboard-label">Plagas</span>
        </div>

        <div className="san-dashboard-item">
          <span className="san-dashboard-number">{totalEnfermedades}</span>
          <span className="san-dashboard-label">Enfermedades</span>
        </div>
      </div>

      <Link to="/sanitario" className="san-btn san-btn-full san-dashboard-link">
        Ir al panel sanitario
      </Link>
    </div>
  );
}
