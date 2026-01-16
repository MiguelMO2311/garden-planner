import type { Enfermedad } from "../types";

interface Props {
  enfermedades: Enfermedad[];
}

export default function EnfermedadList({ enfermedades }: Props) {
  return (
    <div className="san-list">
      {enfermedades.map((e) => (
        <div key={e.id} className="san-list-item">
          <h4>{e.nombre}</h4>
          <p>{e.descripcion}</p>
          <p>
            <strong>Severidad:</strong> {e.severidad}
          </p>
          <span className="san-list-date">{e.fecha_detectada}</span>
        </div>
      ))}
    </div>
  );
}
