// src/features/sanitario/components/DashboardSanitarioCard.tsx
import { useEffect, useState } from "react";
import { getPanelSanitario } from "../api/panelSanitarioApi";
import type { ParcelaSanitariaPanelItem } from "../types";
import { Link } from "react-router-dom";

export default function DashboardSanitarioCard() {
  const [items, setItems] = useState<ParcelaSanitariaPanelItem[]>([]);

  useEffect(() => {
    getPanelSanitario().then(setItems);
  }, []);

  const totalAlertas = items.reduce((acc, p) => acc + p.alertas, 0);
  const totalPlagas = items.reduce((acc, p) => acc + p.plagas, 0);
  const totalEnfermedades = items.reduce((acc, p) => acc + p.enfermedades, 0);

  return (
    <div className="san-dashboard-card">
      <h3>Sanidad Agrícola</h3>

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

      <Link to="/sanitario" className="san-btn san-btn-full">
        Ir al panel sanitario
      </Link>
    </div>
  );
}
