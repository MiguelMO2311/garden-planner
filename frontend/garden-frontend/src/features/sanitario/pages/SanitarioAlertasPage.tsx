import { useEffect, useState } from "react";
import { getAlertasSanitariasGlobal } from "../api/alertasSanitariasApi";
import type { AlertaSanitaria } from "../types";

export default function SanitarioAlertasPage() {
  const [alertas, setAlertas] = useState<AlertaSanitaria[]>([]);

  useEffect(() => {
    getAlertasSanitariasGlobal().then(setAlertas);
  }, []);

  return (
    <div className="san-page">
      <h2 className="san-page-title">Alertas sanitarias</h2>
      <p className="san-page-subtitle">Todas las alertas activas y recientes</p>

      <div className="san-list">
        {alertas.map((a) => (
          <div key={a.id} className="san-card san-evento-card">
            <div className="san-card-header">
              <h3 className="san-card-title">{a.riesgo}</h3>
              <span className={`badge badge-alerta-${a.estado}`}>{a.estado}</span>
            </div>

            <p className="san-card-message">{a.mensaje}</p>

            <div className="san-card-meta">
              <span>Probabilidad: {a.probabilidad}%</span>
              <span>Fecha: {a.fecha}</span>
              <span>Prioridad: {a.prioridad}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
