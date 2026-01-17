// src/features/sanitario/components/SanitarioInfoBox.tsx
import { useEffect, useState } from "react";
import { getAlertasSanitarias } from "../api/alertasSanitariasApi";
import { getPlagas } from "../api/plagasApi";
import { getEnfermedades } from "../api/enfermedadesApi";
import { getTratamientos } from "../api/tratamientosAplicadosApi";
import type { AlertaSanitaria, Plaga, Enfermedad, Tratamiento } from "../types";
import { Link } from "react-router-dom";

interface Props {
  parcelaId: number;
}

export default function SanitarioInfoBox({ parcelaId }: Props) {
  const [alertas, setAlertas] = useState<AlertaSanitaria[]>([]);
  const [plagas, setPlagas] = useState<Plaga[]>([]);
  const [enfermedades, setEnfermedades] = useState<Enfermedad[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);

  useEffect(() => {
    getAlertasSanitarias(parcelaId).then(setAlertas);
    getPlagas(parcelaId).then(setPlagas);
    getEnfermedades(parcelaId).then(setEnfermedades);
    getTratamientos(parcelaId).then(setTratamientos);
  }, [parcelaId]);

  return (
    <div className="san-box">
      <h3 className="san-box-title">Estado sanitario</h3>

      <div className="san-box-grid">
        <div className="san-box-item">
          <span className="san-box-number">{alertas.length}</span>
          <span className="san-box-label">Alertas</span>
        </div>

        <div className="san-box-item">
          <span className="san-box-number">{plagas.length}</span>
          <span className="san-box-label">Plagas</span>
        </div>

        <div className="san-box-item">
          <span className="san-box-number">{enfermedades.length}</span>
          <span className="san-box-label">Enfermedades</span>
        </div>

        <div className="san-box-item">
          <span className="san-box-number">{tratamientos.length}</span>
          <span className="san-box-label">Tratamientos activos</span>
        </div>
      </div>

      <Link to={`/sanitario/${parcelaId}`} className="san-btn san-btn-full">
        Ver detalle sanitario
      </Link>
    </div>
  );
}
