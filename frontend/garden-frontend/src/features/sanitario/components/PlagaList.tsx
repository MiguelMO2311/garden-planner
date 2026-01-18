import type { PlagaDetectada } from "../types";

interface Props {
  plagas: PlagaDetectada[];
}

export default function PlagaList({ plagas }: Props) {
  return (
    <div className="san-list">
      {plagas.map((p) => (
        <div key={p.id} className="san-card san-plaga-card">
          
          {/* CABECERA */}
          <div className="san-card-header">
            <h4 className="san-card-title">{p.nombre}</h4>

            <span className={`badge badge-plaga-${p.severidad.toLowerCase()}`}>
              {p.severidad}
            </span>
          </div>

          {/* DESCRIPCIÓN */}
          <p className="san-card-message">{p.descripcion}</p>

          {/* FECHA */}
          <div className="san-card-meta">
            <span>Detectada: {p.fecha_detectada}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
