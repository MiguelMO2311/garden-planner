// src/features/sanitario/pages/SanitarioRiesgosPage.tsx
import { useEffect, useState } from "react";
import { getRiesgosClimaticosGlobal } from "../api/riesgosSanitariosApi";
import type { RiesgoClimatico } from "../types";

export default function SanitarioRiesgosPage() {
  const [riesgos, setRiesgos] = useState<RiesgoClimatico[]>([]);

  useEffect(() => {
    getRiesgosClimaticosGlobal().then(setRiesgos);
  }, []);

  return (
    <div className="san-page">
      <h2 className="san-page-title">Riesgos sanitarios</h2>
      <p className="san-page-subtitle">Riesgos climáticos detectados en todas las parcelas</p>

      <div className="san-grid">
        {riesgos.map((r) => (
          <div key={r.id} className="san-card san-evento-card">
            <div className="san-card-header">
              <h3 className="san-card-title">{r.riesgo}</h3>
              <span className={`badge badge-evento-${r.estado}`}>{r.estado}</span>
            </div>

            <p className="san-card-message">
              Probabilidad: {r.probabilidad}%<br />
              Temp: {r.temperatura}°C — Humedad: {r.humedad}% — Lluvia: {r.lluvia}mm
            </p>

            <div className="san-card-meta">
              <span>Fecha: {r.fecha}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
