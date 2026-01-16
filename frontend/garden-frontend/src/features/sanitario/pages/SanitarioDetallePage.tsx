// src/features/sanitario/pages/SanitarioDetallePage.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getAlertasSanitarias } from "../api/alertasSanitariasApi";
import { getPlagas } from "../api/plagasApi";
import { getEnfermedades } from "../api/enfermedadesApi";
import { getTratamientos } from "../api/tratamientosApi";
import { getRecomendaciones } from "../api/recomendacionesApi";

import type {
  AlertaSanitaria,
  Plaga,
  Enfermedad,
  Tratamiento,
  Recomendacion,
} from "../types";

import AlertaList from "../components/AlertaList";
import PlagaList from "../components/PlagaList";
import EnfermedadList from "../components/EnfermedadList";
import TratamientoList from "../components/TratamientoList";
import RecomendacionList from "../components/RecomendacionList";

export default function SanitarioDetallePage() {
  const { parcelaId } = useParams();
  const id = Number(parcelaId);

  const [alertas, setAlertas] = useState<AlertaSanitaria[]>([]);
  const [plagas, setPlagas] = useState<Plaga[]>([]);
  const [enfermedades, setEnfermedades] = useState<Enfermedad[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAlertasSanitarias(id),
      getPlagas(id),
      getEnfermedades(id),
      getTratamientos(id),
      getRecomendaciones(id),
    ]).then(([a, p, e, t, r]) => {
      setAlertas(a);
      setPlagas(p);
      setEnfermedades(e);
      setTratamientos(t);
      setRecomendaciones(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="san-loading">Cargando información sanitaria...</div>;
  }

  return (
    <div className="san-page">
      <h2 className="san-page-title">Información Sanitaria</h2>

      {/* ALERTAS */}
      <div className="san-section">
        <h3>Alertas sanitarias</h3>
        <AlertaList alertas={alertas} />
      </div>

      {/* PLAGAS */}
      <div className="san-section">
        <h3>Plagas detectadas</h3>
        <PlagaList plagas={plagas} />
      </div>

      {/* ENFERMEDADES */}
      <div className="san-section">
        <h3>Enfermedades detectadas</h3>
        <EnfermedadList enfermedades={enfermedades} />
      </div>

      {/* TRATAMIENTOS */}
      <div className="san-section">
        <h3>Tratamientos activos</h3>
        <TratamientoList tratamientos={tratamientos} />
      </div>

      {/* RECOMENDACIONES */}
      <div className="san-section">
        <h3>Recomendaciones sanitarias</h3>
        <RecomendacionList recomendaciones={recomendaciones} />
      </div>

      <Link
        to={`/sanitario/${id}/tratamiento/iniciar`}
        className="san-btn san-btn-full san-btn-primary"
      >
        Iniciar tratamiento
      </Link>
    </div>
  );
}
