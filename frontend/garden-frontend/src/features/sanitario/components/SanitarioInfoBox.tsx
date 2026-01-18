import { useEffect, useState } from "react";

import { getAlertasSanitarias } from "../api/alertasSanitariasApi";
import { getPlagasDetectadas } from "../api/plagasApi";
import { getEnfermedadesDetectadas } from "../api/enfermedadesApi";
import { getTratamientosAplicados } from "../api/tratamientosAplicadosApi";

import type {
  AlertaSanitaria,
  PlagaDetectada,
  EnfermedadDetectada,
  TratamientoAplicado
} from "../types";

import { Link } from "react-router-dom";

interface Props {
  parcelaId: number;
}

export default function SanitarioInfoBox({ parcelaId }: Props) {
  const [alertas, setAlertas] = useState<AlertaSanitaria[]>([]);
  const [plagas, setPlagas] = useState<PlagaDetectada[]>([]);
  const [enfermedades, setEnfermedades] = useState<EnfermedadDetectada[]>([]);
  const [tratamientos, setTratamientos] = useState<TratamientoAplicado[]>([]);

  useEffect(() => {
    getAlertasSanitarias(parcelaId).then(setAlertas);
    getPlagasDetectadas(parcelaId).then(setPlagas);
    getEnfermedadesDetectadas(parcelaId).then(setEnfermedades);
    getTratamientosAplicados(parcelaId).then(setTratamientos);
  }, [parcelaId]);

  return (
    <div className="san-card san-info-box">
      <div className="san-info-header">
        <h3 className="san-info-title">Estado sanitario</h3>
        <p className="san-info-subtitle">Resumen general de la parcela</p>
      </div>

      <div className="san-info-grid">
        <div className="san-info-item">
          <span className="san-info-number">{alertas.length}</span>
          <span className="san-info-label">Alertas</span>
        </div>

        <div className="san-info-item">
          <span className="san-info-number">{plagas.length}</span>
          <span className="san-info-label">Plagas</span>
        </div>

        <div className="san-info-item">
          <span className="san-info-number">{enfermedades.length}</span>
          <span className="san-info-label">Enfermedades</span>
        </div>

        <div className="san-info-item">
          <span className="san-info-number">{tratamientos.length}</span>
          <span className="san-info-label">Tratamientos activos</span>
        </div>
      </div>

      <Link
        to={`/sanitario/${parcelaId}`}
        className="san-btn san-btn-primary san-btn-full san-info-link"
      >
        Ver detalle sanitario
      </Link>
    </div>
  );
}
