import type { EnfermedadDetectada } from "../types";


interface Props {
  enfermedades: EnfermedadDetectada [];
}

export default function EnfermedadList({ enfermedades }: Props) {
  return (
    <div className="san-list">
      {enfermedades.map((e) => (
        <div key={e.id} className="san-card san-enfermedad-card">
          <div className="san-card-header">
            <h4 className="san-card-title">{e.nombre}</h4>

            <span className={`badge badge-severidad-${e.severidad.toLowerCase()}`}>
              {e.severidad}
            </span>
          </div>

          <p className="san-card-message">{e.descripcion}</p>

          <div className="san-card-meta">
            <span>Detectada: {e.fecha_detectada}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
