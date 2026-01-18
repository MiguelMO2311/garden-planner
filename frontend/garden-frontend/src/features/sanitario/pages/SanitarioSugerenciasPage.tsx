import { useEffect, useState } from "react";
import { getRecomendacionesGlobal } from "../api/recomendacionesApi";
import type { Recomendacion } from "../types";

export default function SanitarioSugerenciasPage() {
  const [reco, setReco] = useState<Recomendacion[]>([]);

  useEffect(() => {
    getRecomendacionesGlobal().then(setReco);
  }, []);

  return (
    <div className="san-page">
      <h2 className="san-page-title">Sugerencias sanitarias</h2>
      <p className="san-page-subtitle">Recomendaciones generadas por el sistema</p>

      <div className="san-list">
        {reco.map((r) => (
          <div key={r.id} className="san-card san-recomendacion-card">
            <div className="san-card-header">
              <h3 className="san-card-title">Recomendación #{r.id}</h3>
              <span className={`badge badge-reco-${r.estado}`}>{r.estado}</span>
            </div>

            <p className="san-card-message">{r.mensaje}</p>

            <div className="san-card-meta">
              <span>Fecha sugerida: {r.fecha_sugerida}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
