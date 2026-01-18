import type { EventoSanitario } from "../types";
import { resolverEvento } from "../api/eventosSanitariosApi";

interface Props {
  eventos: EventoSanitario[];
  onRefresh?: () => void;
}

export default function EventoList({ eventos, onRefresh }: Props) {
  const handleResolver = async (id: number) => {
    await resolverEvento(id);
    onRefresh?.();
  };

  return (
    <div className="san-list">
      {eventos.map((e) => (
        <div key={e.id} className="san-card san-evento-card">
          
          {/* CABECERA */}
          <div className="san-card-header">
            <h4 className="san-card-title">{e.riesgo}</h4>

            <span className={`badge badge-evento-${e.estado}`}>
              {e.estado === "activa" ? "Activa" : "Resuelta"}
            </span>
          </div>

          {/* OBJETIVO */}
          <p className="san-card-message">
            <strong>Objetivo:</strong> {e.objetivo}
          </p>

          {/* NOTAS */}
          {e.notas && (
            <p className="san-card-notes">{e.notas}</p>
          )}

          {/* INFO */}
          <div className="san-card-meta">
            <span>Fecha: {e.fecha}</span>
            <span>Probabilidad: {(e.probabilidad * 100).toFixed(0)}%</span>
          </div>

          {/* ACCIONES */}
          {e.estado === "activa" && (
            <div className="san-card-actions">
              <button
                onClick={() => handleResolver(e.id)}
                className="san-btn san-btn-primary san-btn-small"
              >
                Resolver evento
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
