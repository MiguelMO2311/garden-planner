import type { TareaSanitaria } from "../types";
import { completarTareaSanitaria } from "../api/tareasSanitariasApi";

interface Props {
  tareas: TareaSanitaria[];
  onRefresh?: () => void;
}

export default function TareaSanitariaList({ tareas, onRefresh }: Props) {
  const handleCompletar = async (id: number) => {
    await completarTareaSanitaria(id);
    onRefresh?.();
  };

  return (
    <div className="san-list">
      {tareas.map((t) => (
        <div key={t.id} className="san-card san-tarea-card">
          
          {/* CABECERA */}
          <div className="san-card-header">
            <h4 className="san-card-title">{t.titulo}</h4>

            <span className={`badge badge-tarea-${t.estado}`}>
              {t.estado}
            </span>
          </div>

          {/* DESCRIPCIÓN */}
          <p className="san-card-message">{t.descripcion}</p>

          {/* FECHAS */}
          <div className="san-card-meta">
            <span>Inicio: {t.fecha}</span>
            {t.fecha_fin && <span>Finalizada: {t.fecha_fin}</span>}
          </div>

          {/* ACCIÓN */}
          {(t.estado === "pendiente" || t.estado === "en_progreso") && (
            <button
              onClick={() => handleCompletar(t.id)}
              className="san-btn san-btn-success san-btn-small"
            >
              Completar tarea
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

