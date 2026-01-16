import type { Plaga } from "../types";

interface Props {
  plagas: Plaga[];
}

export default function PlagaList({ plagas }: Props) {
  return (
    <div className="san-list">
      {plagas.map((p) => (
        <div key={p.id} className="san-list-item">
          <h4>{p.nombre}</h4>
          <p>{p.descripcion}</p>
          <p>
            <strong>Severidad:</strong> {p.severidad}
          </p>
          <span className="san-list-date">{p.fecha_detectada}</span>
        </div>
      ))}
    </div>
  );
}
