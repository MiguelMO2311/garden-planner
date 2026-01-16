// src/features/sanitario/components/AlertaList.tsx
import type { AlertaSanitaria } from "../types";

interface Props {
  alertas: AlertaSanitaria[];
}

export default function AlertaList({ alertas }: Props) {
  return (
    <div className="san-list">
      {alertas.map((a) => (
        <div key={a.id} className="san-list-item">
          <h4>{a.titulo}</h4>
          <p>{a.descripcion}</p>
          <span className="san-list-date">{a.fecha}</span>
        </div>
      ))}
    </div>
  );
}
