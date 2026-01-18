import type { AlertaSanitaria } from "../types";
import { confirmarAlerta, descartarAlerta } from "../api/alertasSanitariasApi";

interface Props {
  alertas: AlertaSanitaria[];
  onRefresh?: () => void;
}

export default function AlertaList({ alertas, onRefresh }: Props) {
  const handleConfirmar = async (id: number) => {
    await confirmarAlerta(id);
    onRefresh?.();
  };

  const handleDescartar = async (id: number) => {
    await descartarAlerta(id);
    onRefresh?.();
  };

  return (
    <div className="san-list">
      {alertas.map((a) => (
        <div key={a.id} className="san-card san-alerta-card">
          
          {/* CABECERA */}
          <div className="san-card-header">
            <h4 className="san-card-title">{a.riesgo}</h4>

            <span className={`badge badge-alerta-${a.estado}`}>
              {a.estado}
            </span>
          </div>

          {/* MENSAJE */}
          <p className="san-card-message">{a.mensaje}</p>

          {/* INFO */}
          <div className="san-card-meta">
            <span>Fecha: {a.fecha}</span>
            <span>Probabilidad: {(a.probabilidad * 100).toFixed(0)}%</span>
          </div>

          {/* ACCIONES */}
          {a.estado === "pendiente" && (
            <div className="san-card-actions">
              <button
                onClick={() => handleConfirmar(a.id)}
                className="san-btn san-btn-primary san-btn-small"
              >
                Confirmar
              </button>

              <button
                onClick={() => handleDescartar(a.id)}
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
