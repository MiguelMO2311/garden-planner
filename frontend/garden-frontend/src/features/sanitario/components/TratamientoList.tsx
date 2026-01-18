import type { TratamientoAplicado } from "../types";
import { finalizarTratamiento } from "../api/tratamientosAplicadosApi";

interface Props {
  tratamientos: TratamientoAplicado[];
  onRefresh?: () => void;
}

export default function TratamientoAplicadoList({ tratamientos, onRefresh }: Props) {
  const handleFinalizar = async (id: number) => {
    await finalizarTratamiento(id);
    onRefresh?.();
  };

  return (
    <div className="san-list">
      {tratamientos.map((t) => (
        <div key={t.id} className="san-card san-tratamiento-card">
          
          {/* CABECERA */}
          <div className="san-card-header">
            <h4 className="san-card-title">Tratamiento #{t.id}</h4>

            <span className={`badge badge-trat-${t.estado}`}>
              {t.estado}
            </span>
          </div>

          {/* FECHAS */}
          <div className="san-card-message">
            <p><strong>Inicio:</strong> {t.fecha_inicio}</p>
            {t.fecha_fin_prevista && (
              <p><strong>Fin previsto:</strong> {t.fecha_fin_prevista}</p>
            )}
            {t.fecha_fin && (
              <p><strong>Finalizado:</strong> {t.fecha_fin}</p>
            )}
          </div>

          {/* ACCIÓN */}
          {t.estado === "en_progreso" && (
            <button
              onClick={() => handleFinalizar(t.id)}
              className="san-btn san-btn-success san-btn-small"
            >
              Finalizar tratamiento
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
