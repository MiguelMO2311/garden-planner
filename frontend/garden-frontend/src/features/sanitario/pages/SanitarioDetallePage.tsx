import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import SanitarioInfoBox from "../components/SanitarioInfoBox";
import PlagaList from "../components/PlagaList";
import EnfermedadList from "../components/EnfermedadList";
import TratamientoAplicadoList from "../components/TratamientoAplicadoList";
import EventoList from "../components/EventoList";
import RecomendacionList from "../components/RecomendacionList";
import AlertaList from "../components/AlertaList";

import { getPlagasDetectadas } from "../api/plagasApi";
import { getEnfermedadesDetectadas } from "../api/enfermedadesApi";
import { getTratamientosAplicados } from "../api/tratamientosAplicadosApi";
import { getEventosSanitarios } from "../api/eventosSanitariosApi";
import { getRecomendaciones } from "../api/recomendacionesApi";
import { getAlertasSanitarias } from "../api/alertasSanitariasApi";

import type {
  PlagaDetectada,
  EnfermedadDetectada,
  TratamientoAplicado,
  EventoSanitario,
  Recomendacion,
  AlertaSanitaria
} from "../types";

import "../sanitario.css";

export default function SanitarioDetallePage() {
  const { parcelaId } = useParams();
  const id = Number(parcelaId);

  const [plagas, setPlagas] = useState<PlagaDetectada[]>([]);
  const [enfermedades, setEnfermedades] = useState<EnfermedadDetectada[]>([]);
  const [tratamientos, setTratamientos] = useState<TratamientoAplicado[]>([]);
  const [eventos, setEventos] = useState<EventoSanitario[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [alertas, setAlertas] = useState<AlertaSanitaria[]>([]);

  const refresh = useCallback(() => {
    getPlagasDetectadas(id).then(setPlagas);
    getEnfermedadesDetectadas(id).then(setEnfermedades);
    getTratamientosAplicados(id).then(setTratamientos);
    getEventosSanitarios(id).then(setEventos);
    getRecomendaciones(id).then(setRecomendaciones);
    getAlertasSanitarias(id).then(setAlertas);
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="san-page">
      <header className="san-page-header">
        <h1 className="san-page-title">Detalle sanitario</h1>
        <p className="san-page-subtitle">
          Estado completo de la parcela #{id}
        </p>
      </header>

      {/* RESUMEN */}
      <section className="san-section">
        <SanitarioInfoBox parcelaId={id} />
      </section>

      {/* PLAGAS */}
      <section className="san-section">
        <h2 className="san-section-title">Plagas detectadas</h2>
        <PlagaList plagas={plagas} />
      </section>

      {/* ENFERMEDADES */}
      <section className="san-section">
        <h2 className="san-section-title">Enfermedades detectadas</h2>
        <EnfermedadList enfermedades={enfermedades} />
      </section>

      {/* TRATAMIENTOS */}
      <section className="san-section">
        <h2 className="san-section-title">Tratamientos aplicados</h2>
        <TratamientoAplicadoList tratamientos={tratamientos} onRefresh={refresh} />
      </section>

      {/* ALERTAS */}
      <section className="san-section">
        <h2 className="san-section-title">Alertas sanitarias</h2>
        <AlertaList alertas={alertas} onRefresh={refresh} />
      </section>

      {/* EVENTOS */}
      <section className="san-section">
        <h2 className="san-section-title">Eventos sanitarios</h2>
        <EventoList eventos={eventos} onRefresh={refresh} />
      </section>

      {/* RECOMENDACIONES */}
      <section className="san-section">
        <h2 className="san-section-title">Recomendaciones</h2>
        <RecomendacionList recomendaciones={recomendaciones} onRefresh={refresh} />
      </section>
    </div>
  );
}
