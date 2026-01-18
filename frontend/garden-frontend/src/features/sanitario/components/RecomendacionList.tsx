import type { Recomendacion } from "../types";
import {
  activarRecomendacion,
  realizarRecomendacion,
  descartarRecomendacion,
} from "../api/recomendacionesApi";

interface Props {
  recomendaciones: Recomendacion[];
  onRefresh?: () => void;
}

export default function RecomendacionList({ recomendaciones, onRefresh }: Props) {
  const handleActivar = async (id: number) => {
    await activarRecomendacion(id);
    onRefresh?.();
  };

  const handleRealizar = async (id: number) => {
    await realizarRecomendacion(id);
    onRefresh?.();
  };

  const handleDescartar = async (id: number) => {
    await descartarRecomendacion(id);
    onRefresh?.();
  };

  return (
    <div className="san-list">
      {recomendaciones.map((r) => (
        <div key={r.id} className="san-card san-recomendacion-card">
          
          {/* CABECERA */}
          <div className="san-card-header">
            <h4 className="san-card-title">Recomendación</h4>

            <span className={`badge badge-reco-${r.estado}`}>
              {r.estado}
            </span>
          </div>

          {/* MENSAJE */}
          <p className="san-card-message">{r.mensaje}</p>

          {/* FECHA */}
          <div className="san-card-meta">
            <span>Fecha sugerida: {r.fecha_sugerida}</span>
          </div>

          {/* ACCIONES */}
          {r.estado === "pendiente" && (
            <div className="san-card-actions">
              <button
                onClick={() => handleActivar(r.id)}
                className="san-btn san-btn-primary san-btn-small"
              >
                Activar
              </button>

              <button
                onClick={() => handleRealizar(r.id)}
                className="san-btn san-btn-success san-btn-small"
              >
                Realizada
              </button>

              <button
                onClick={() => handleDescartar(r.id)}
                className="san-btn san-btn-danger san-btn-small"
              >
                Descartar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
