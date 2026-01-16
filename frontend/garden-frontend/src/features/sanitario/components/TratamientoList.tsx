// src/features/sanitario/components/TratamientoList.tsx
import type { Tratamiento } from "../types";

interface Props {
  tratamientos: Tratamiento[];
}

export default function TratamientoList({ tratamientos }: Props) {
  return (
    <div className="san-list">
      {tratamientos.map((t) => (
        <div key={t.id} className="san-list-item">
          <h4>{t.producto}</h4>
          <p><strong>Inicio:</strong> {t.fecha_inicio}</p>
          <p><strong>Fin:</strong> {t.fecha_fin}</p>
        </div>
      ))}
    </div>
  );
}
