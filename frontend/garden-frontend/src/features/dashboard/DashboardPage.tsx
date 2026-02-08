import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCounter } from "../hooks/useCounter";
import type { ClimateEvent as BaseClimateEvent } from "../parcelas/types";

import {
  FaMapMarkedAlt,
  FaTasks,
  FaCalendarAlt,
} from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";

import {
  WiRain,
  WiDaySunny,
  WiSnow,
  WiStrongWind,
  WiStormShowers,
  WiThermometer,
} from "react-icons/wi";

import {
  getRiesgosClimaticosGlobal,
} from "../sanitario/api/riesgosSanitariosApi";
import {
  getAlertasSanitariasGlobal,
} from "../sanitario/api/alertasSanitariasApi";
import {
  getRecomendacionesGlobal,
} from "../sanitario/api/recomendacionesApi";
import {
  getTratamientosAplicadosGlobal,
} from "../sanitario/api/tratamientosAplicadosApi";

import type {
  RiesgoClimatico,
  AlertaSanitaria,
  Recomendacion,
  TratamientoAplicado,
} from "../sanitario/types";

import "./dashboard.css";

/* ------------------------------------------------------ */
/* TIPOS                                                  */
/* ------------------------------------------------------ */

type WeeklyAlert = {
  plot_id: number;
  plot_name: string;
  cultivo_parcela_id: number;
  cultivo_tipo_nombre: string;
  fecha: string | null;
  tipo: string;
  mensaje: string;
  nivel: "info" | "warning" | "danger" | string;
};

type ClimateEvent = BaseClimateEvent & {
  plot_id?: number;
  plot_name?: string;
};

interface Tarea {
  id: number;
  estado: string;
  [key: string]: unknown;
}

/* ------------------------------------------------------ */
/* HELPERS                                                */
/* ------------------------------------------------------ */

const formatFecha = (fechaStr: string | null) => {
  if (!fechaStr) return "Fecha sin especificar";

  const fecha = new Date(fechaStr);

  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const nombreDia = dias[fecha.getDay()];
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();

  return `${nombreDia}, ${dia}/${mes}/${año}`;
};

const iconForEvent = (type: string) => {
  switch (type) {
    case "lluvia":
      return <WiRain size={32} color="#0d6efd" />;
    case "tormenta":
      return <WiStormShowers size={32} color="#6f42c1" />;
    case "granizo":
      return <WiSnow size={32} color="#20c997" />;
    case "ola_de_calor":
    case "calor":
      return <WiThermometer size={32} color="#dc3545" />;
    case "helada":
      return <WiSnow size={32} color="#0dcaf0" />;
    case "viento_fuerte":
    case "viento":
      return <WiStrongWind size={32} color="#198754" />;
    default:
      return <WiDaySunny size={32} />;
  }
};

const badgeClassForLevel = (nivel: string) => {
  switch (nivel) {
    case "danger":
      return "bg-danger";
    case "warning":
      return "bg-warning text-dark";
    case "info":
    default:
      return "bg-info text-dark";
  }
};

/* ------------------------------------------------------ */
/* COMPONENTE PRINCIPAL                                   */
/* ------------------------------------------------------ */

export default function DashboardPage() {
  const navigate = useNavigate();

  /* ---------------- CONTADORES BÁSICOS ----------------- */

  const [counts, setCounts] = useState({
    parcelas: 0,
    cultivos: 0,
    tareas: 0,
    calendario: 0,
  });

  const parcelasCount = useCounter(counts.parcelas);
  const cultivosCount = useCounter(counts.cultivos);
  const tareasCount = useCounter(counts.tareas);
  const calendarioCount = useCounter(counts.calendario);

  /* ---------------- CLIMA Y ALERTAS -------------------- */

  const [recentEvents, setRecentEvents] = useState<ClimateEvent[]>([]);
  const [weeklyAlerts, setWeeklyAlerts] = useState<WeeklyAlert[]>([]);
  const [alertIndex, setAlertIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);

  /* ---------------- SANITARIO GLOBAL ------------------- */

  const [sanitario, setSanitario] = useState<{
    riesgos: RiesgoClimatico[];
    alertas: AlertaSanitaria[];
    recomendaciones: Recomendacion[];
    tratamientos: TratamientoAplicado[];
  }>({
    riesgos: [],
    alertas: [],
    recomendaciones: [],
    tratamientos: [],
  });

  /* ------------------------------------------------------ */
  /* CARGA DE DATOS                                         */
  /* ------------------------------------------------------ */

  const loadCounts = useCallback(async () => {
    try {
      const [p, dashboardData, tareas] = await Promise.all([
        api.get("/plots"),
        api.get("/dashboard"),
        api.get("/tareas"),
      ]);

      const tareasPendientes = (tareas.data as Tarea[]).filter(
        (x) => x.estado !== "completada"
      ).length;

      setCounts({
        parcelas: p.data.length,
        cultivos: Math.floor(dashboardData?.data?.cultivos_count ?? 0),
        tareas: tareas.data.length,
        calendario: tareasPendientes,
      });
    } catch (err) {
      console.error("Error cargando contadores:", err);
    }
  }, []);

  const loadClimate = useCallback(async () => {
    try {
      const res = await api.get("/clima/recientes");
      setRecentEvents(res.data);
    } catch (err) {
      console.error("Error cargando eventos climáticos:", err);
    }
  }, []);

  const loadWeeklyAlerts = useCallback(async () => {
    try {
      const res = await api.get("/clima/alertas-semana");
      const alerts = res.data as WeeklyAlert[];

      const normalized = alerts.map((a) => ({
        ...a,
        cultivo_tipo_nombre: a.cultivo_tipo_nombre ?? "Cultivo",
      }));

      setWeeklyAlerts(normalized);
    } catch (err) {
      console.error("Error cargando alertas semanales:", err);
    }
  }, []);

  const loadSanitario = useCallback(async () => {
    try {
      const [riesgos, alertas, recomendaciones, tratamientos] = await Promise.all([
        getRiesgosClimaticosGlobal(),
        getAlertasSanitariasGlobal(),
        getRecomendacionesGlobal(),
        getTratamientosAplicadosGlobal(),
      ]);

      setSanitario({
        riesgos,
        alertas,
        recomendaciones,
        tratamientos,
      });
    } catch (err) {
      console.error("Error cargando datos sanitarios:", err);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      await loadCounts();
      await loadClimate();
      await loadWeeklyAlerts();
      await loadSanitario();
    };

    fetchAll();
  }, [loadCounts, loadClimate, loadWeeklyAlerts, loadSanitario]);

  /* ------------------------------------------------------ */
  /* CARRUSEL AUTOMÁTICO                                    */
  /* ------------------------------------------------------ */

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertIndex((prev) =>
        weeklyAlerts.length > 0 ? (prev + 1) % weeklyAlerts.length : 0
      );
      setEventIndex((prev) =>
        recentEvents.length > 0 ? (prev + 1) % recentEvents.length : 0
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [weeklyAlerts.length, recentEvents.length]);

  /* ------------------------------------------------------ */
  /* RENDER                                                 */
  /* ------------------------------------------------------ */

  const hasSanitarioData =
    sanitario.riesgos.length > 0 ||
    sanitario.alertas.length > 0 ||
    sanitario.recomendaciones.length > 0 ||
    sanitario.tratamientos.length > 0;

  return (
    <div className="dashboard-bg">
      <div className="dashboard-grid">

        {/* ----------------- CARDS PEQUEÑAS ----------------- */}
        <div className="dashboard-card-saas dashboard-small-card dashboard-card-parcelas" style={{ gridColumn: "span 3" }}
          onClick={() => navigate("/parcelas")}
        >
          <FaMapMarkedAlt className="dashboard-icon text-primary" />
          <h6 className="fw-bold mb-0 mt-2">Parcelas</h6>
          <span className="dashboard-counter text-primary">{parcelasCount}</span>
        </div>

        <div className="dashboard-card-saas dashboard-small-card dashboard-card-cultivos" style={{ gridColumn: "span 3" }}
          onClick={() => navigate("/cultivos-parcela")}
        >
          <GiPlantRoots className="dashboard-icon text-success" />
          <h6 className="fw-bold mb-0 mt-2">Cultivos</h6>
          <span className="dashboard-counter text-success">{cultivosCount}</span>
        </div>

        <div className="dashboard-card-saas dashboard-small-card dashboard-card-tareas" style={{ gridColumn: "span 3" }}
          onClick={() => navigate("/tareas")}
        >
          <FaTasks className="dashboard-icon text-warning" />
          <h6 className="fw-bold mb-0 mt-2">Tareas</h6>
          <span className="dashboard-counter text-warning">{tareasCount}</span>
        </div>

        <div className="dashboard-card-saas dashboard-small-card dashboard-card-calendario" style={{ gridColumn: "span 3" }}
          onClick={() => navigate("/calendario")}
        >
          <FaCalendarAlt className="dashboard-icon text-danger" />
          <h6 className="fw-bold mb-0 mt-2">Calendario</h6>
          <span className="dashboard-counter text-danger">{calendarioCount}</span>
        </div>

        {/* ----------------- PANEL SANITARIO ----------------- */}
        {hasSanitarioData && (
          <div
            className="dashboard-card-sanitario"
            style={{ gridColumn: "span 12" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">🌿 Panel sanitario</h4>
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => navigate("/sanitario/panel")}
              >
                Ver módulo sanitario →
              </button>
            </div>

            <div className="sanitario-grid">
              <div className="sanitario-item">
                <svg className="sanitario-icon" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#dc3545" strokeWidth="2" />
                  <path d="M12 6v6" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1" fill="#dc3545" />
                </svg>
                <span className="sanitario-number text-danger">
                  {sanitario.riesgos.length}
                </span>
                <div className="sanitario-label">Riesgos</div>
              </div>

              <div className="sanitario-item">
                <svg className="sanitario-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="3" stroke="#ffc107" strokeWidth="2" />
                  <path d="M8 10h8M8 14h5" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="sanitario-number text-warning">
                  {sanitario.alertas.length}
                </span>
                <div className="sanitario-label">Alertas</div>
              </div>

              <div className="sanitario-item">
                <svg className="sanitario-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l4 4 10-10" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sanitario-number text-success">
                  {sanitario.recomendaciones.length}
                </span>
                <div className="sanitario-label">Recomendaciones</div>
              </div>

              <div className="sanitario-item">
                <svg className="sanitario-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="5" width="14" height="14" rx="2" stroke="#0d6efd" strokeWidth="2" />
                  <path d="M9 12h6" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="sanitario-number text-primary">
                  {sanitario.tratamientos.length}
                </span>
                <div className="sanitario-label">Tratamientos</div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- ALERTAS AGRÍCOLAS --------------- */}
        <div className="dashboard-card-saas dashboard-card-alerts" style={{ gridColumn: "span 6" }}>
          <h4 className="fw-bold mb-3">Alertas agrícolas de la semana</h4>

          {weeklyAlerts.length === 0 && (
            <p className="text-muted mb-0">
              No hay alertas agrícolas para los próximos días.
            </p>
          )}

          {weeklyAlerts.length === 1 && (
            <div className="dashboard-carousel-item dashboard-item-bg-alert">
              <div className="dashboard-item-icon">
                {iconForEvent(weeklyAlerts[0].tipo)}
              </div>
              <div className="dashboard-item-content">
                <div className="d-flex justify-content-between">
                  <strong>
                    {weeklyAlerts[0].plot_name} — {weeklyAlerts[0].cultivo_tipo_nombre}
                  </strong>
                  <small className="text-muted">{formatFecha(weeklyAlerts[0].fecha)}</small>
                </div>
                <div className="mt-1">
                  <span className={`badge ${badgeClassForLevel(weeklyAlerts[0].nivel)} me-2`}>
                    {weeklyAlerts[0].tipo}
                  </span>
                  <span>{weeklyAlerts[0].mensaje}</span>
                </div>
              </div>
            </div>
          )}

          {weeklyAlerts.length > 1 && (
            <div className="dashboard-carousel">
              <div
                className="dashboard-carousel-inner"
                style={{ transform: `translateY(-${alertIndex * 90}px)` }}
              >
                {weeklyAlerts.map((alert, idx) => (
                  <div key={idx} className="dashboard-carousel-item dashboard-item-bg-alert">
                    <div className="dashboard-item-icon">
                      {iconForEvent(alert.tipo)}
                    </div>
                    <div className="dashboard-item-content">
                      <div className="d-flex justify-content-between">
                        <strong>{alert.plot_name} — {alert.cultivo_tipo_nombre}</strong>
                        <small className="text-muted">{formatFecha(alert.fecha)}</small>
                      </div>
                      <div className="mt-1">
                        <span className={`badge ${badgeClassForLevel(alert.nivel)} me-2`}>
                          {alert.tipo}
                        </span>
                        <span>{alert.mensaje}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ----------------- EVENTOS CLIMÁTICOS -------------- */}
        <div className="dashboard-card-saas dashboard-card-events" style={{ gridColumn: "span 6" }}>
          <h4 className="fw-bold mb-3">Eventos climáticos recientes</h4>

          {recentEvents.length === 0 && (
            <div className="dashboard-carousel-item dashboard-item-bg-event">
              <p className="text-muted mb-0">No hay eventos climáticos recientes.</p>
            </div>
          )}

          {recentEvents.length === 1 && (
            <div className="dashboard-carousel-item dashboard-item-bg-event">
              <div className="dashboard-item-icon">
                {iconForEvent(recentEvents[0].type)}
              </div>
              <div className="dashboard-item-content">
                <div className="d-flex justify-content-between">
                  <strong>{recentEvents[0].plot_name || "Parcela desconocida"}</strong>
                  <small className="text-muted">{formatFecha(recentEvents[0].date)}</small>
                </div>
                <div className="mt-1">
                  <span className="badge bg-info text-dark me-2">{recentEvents[0].type}</span>
                  <span>{recentEvents[0].description}</span>
                </div>
              </div>
            </div>
          )}

          {recentEvents.length > 1 && (
            <div className="dashboard-carousel">
              <div
                className="dashboard-carousel-inner"
                style={{ transform: `translateY(-${eventIndex * 90}px)` }}
              >
                {recentEvents.map((ev, idx) => (
                  <div key={idx} className="dashboard-carousel-item dashboard-item-bg-event">
                    <div className="dashboard-item-icon">
                      {iconForEvent(ev.type)}
                    </div>
                    <div className="dashboard-item-content">
                      <div className="d-flex justify-content-between">
                                                <strong>{ev.plot_name || "Parcela desconocida"}</strong>
                        <small className="text-muted">{formatFecha(ev.date)}</small>
                      </div>
                      <div className="mt-1">
                        <span className="badge bg-info text-dark me-2">{ev.type}</span>
                        <span>{ev.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
