// src/features/sanitario/components/RecomendacionList.tsx
import type { Recomendacion } from "../types";

interface Props {
  recomendaciones: Recomendacion[];
}

export default function RecomendacionList({ recomendaciones }: Props) {
  return (
    <div className="san-list">
      {recomendaciones.map((r) => (
        <div key={r.id} className="san-list-item">
          <h4>{r.titulo}</h4>
          <p>{r.descripcion}</p>
        </div>
      ))}
    </div>
  );
}
