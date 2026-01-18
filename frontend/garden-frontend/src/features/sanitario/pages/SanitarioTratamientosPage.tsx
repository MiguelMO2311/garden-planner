import { useEffect, useState } from "react";
import { getTratamientosAplicadosGlobal } from "../api/tratamientosAplicadosApi";
import type { TratamientoAplicado } from "../types";

export default function SanitarioTratamientosPage() {
  const [tratamientos, setTratamientos] = useState<TratamientoAplicado[]>([]);

  useEffect(() => {
    getTratamientosAplicadosGlobal().then(setTratamientos);
  }, []);

  return (
    <div className="san-page">
      <h2 className="san-page-title">Tratamientos aplicados</h2>
      <p className="san-page-subtitle">Historial y estado de tratamientos</p>

      <div className="san-list">
        {tratamientos.map((t) => (
          <div key={t.id} className="san-card san-tratamiento-card">
            <div className="san-card-header">
              <h3 className="san-card-title">Tratamiento #{t.tratamiento_id}</h3>
              <span className={`badge badge-trat-${t.estado}`}>{t.estado}</span>
            </div>

            <p className="san-card-message">{t.observaciones}</p>

            <div className="san-card-meta">
              <span>Inicio: {t.fecha_inicio}</span>
              {t.fecha_fin && <span>Fin: {t.fecha_fin}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
