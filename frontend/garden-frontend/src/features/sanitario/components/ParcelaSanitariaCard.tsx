import { Link } from "react-router-dom";
import type { ParcelaSanitariaPanelItem } from "../types";

interface Props {
  item: ParcelaSanitariaPanelItem;
}

export default function ParcelaSanitariaCard({ item }: Props) {
  return (
    <div className="san-card">
      <div className="san-card-header">
        <h3>{item.parcela_nombre}</h3>
        <span className={`san-riesgo san-riesgo-${item.riesgo.toLowerCase()}`}>
          {item.riesgo}
        </span>
      </div>

      <div className="san-card-body">
        <p><strong>Cultivos:</strong> {item.cultivos.join(", ")}</p>
        <p><strong>Alertas:</strong> {item.alertas}</p>
        <p><strong>Plagas:</strong> {item.plagas}</p>
        <p><strong>Enfermedades:</strong> {item.enfermedades}</p>
        <p><strong>Tratamientos activos:</strong> {item.tratamientos_activos}</p>
      </div>

      <div className="san-card-footer">
        <Link to={`/sanitario/${item.parcela_id}`} className="san-btn">
          Ver información sanitaria
        </Link>
      </div>
    </div>
  );
}
