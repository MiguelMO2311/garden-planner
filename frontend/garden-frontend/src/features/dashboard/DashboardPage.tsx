import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCounter } from "./../hooks/useCounter";
import type { ClimateEvent as BaseClimateEvent } from "../parcelas/types";

import { FaMapMarkedAlt, FaTasks, FaCalendarAlt } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";

import {
    WiRain,
    WiDaySunny,
    WiSnow,
    WiStrongWind,
    WiStormShowers,
    WiThermometer,
} from "react-icons/wi";

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
/* FORMATEADOR DE FECHAS                                  */
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



/* ------------------------------------------------------ */
/* DASHBOARD                                              */
/* ------------------------------------------------------ */

export default function DashboardPage() {
    const navigate = useNavigate();

    const [counts, setCounts] = useState({
        parcelas: 0,
        cultivos: 0,
        tareas: 0,
        calendario: 0,
    });

    const [recentEvents, setRecentEvents] = useState<ClimateEvent[]>([]);
    const [loadingClimate, setLoadingClimate] = useState(true);

    const [weeklyAlerts, setWeeklyAlerts] = useState<WeeklyAlert[]>([]);
    const [loadingAlerts, setLoadingAlerts] = useState(true);

    const [alertIndex, setAlertIndex] = useState(0);
    const [eventIndex, setEventIndex] = useState(0);

    const ITEMS_PER_PAGE = 2;

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
        } finally {
            setLoadingClimate(false);
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
        } finally {
            setLoadingAlerts(false);
        }
    }, []);

    useEffect(() => {
        loadCounts();
        loadClimate();
        loadWeeklyAlerts();
    }, [loadCounts, loadClimate, loadWeeklyAlerts]);

    /* ------------------------------------------------------ */
    /* CONTADORES                                             */
    /* ------------------------------------------------------ */

    const parcelasCount = useCounter(counts.parcelas);
    const cultivosCount = useCounter(counts.cultivos);
    const tareasCount = useCounter(counts.tareas);
    const calendarioCount = useCounter(counts.calendario);

    /* ------------------------------------------------------ */
    /* ICONOS                                                 */
    /* ------------------------------------------------------ */

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
    /* CARRUSEL                                               */
    /* ------------------------------------------------------ */

    const visibleAlerts = weeklyAlerts.slice(alertIndex, alertIndex + ITEMS_PER_PAGE);
    const visibleEvents = recentEvents.slice(eventIndex, eventIndex + ITEMS_PER_PAGE);

    const handleNextAlert = () => {
        if (alertIndex + ITEMS_PER_PAGE < weeklyAlerts.length) {
            setAlertIndex(alertIndex + ITEMS_PER_PAGE);
        }
    };

    const handlePrevAlert = () => {
        if (alertIndex - ITEMS_PER_PAGE >= 0) {
            setAlertIndex(alertIndex - ITEMS_PER_PAGE);
        }
    };

    const handleNextEvent = () => {
        if (eventIndex + ITEMS_PER_PAGE < recentEvents.length) {
            setEventIndex(eventIndex + ITEMS_PER_PAGE);
        }
    };

    const handlePrevEvent = () => {
        if (eventIndex - ITEMS_PER_PAGE >= 0) {
            setEventIndex(eventIndex - ITEMS_PER_PAGE);
        }
    };

    const highRiskEvents = recentEvents.filter(ev => ev.intensity > 0.7);

    /* ------------------------------------------------------ */
    /* RENDER                                                 */
    /* ------------------------------------------------------ */

    return (
        <div className="dashboard-bg dashboard-layout">

            {/* TARJETAS PEQUEÑAS */}
            <div className="row g-3 mb-3 dashboard-metrics-row">
                <div className="col-6 col-lg-3">
                    <div className="dashboard-card-saas dashboard-metric-card" onClick={() => navigate("/parcelas")}>
                        <FaMapMarkedAlt className="dashboard-icon text-primary small-icon" />
                        <div>
                            <h6 className="fw-bold mb-0">Parcelas</h6>
                            <span className="dashboard-metric-number text-primary">{parcelasCount}</span>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    {/* 🔥 CAMBIO 2: navegación corregida */}
                    <div className="dashboard-card-saas dashboard-metric-card" onClick={() => navigate("/cultivos-parcela")}>
                        <GiPlantRoots className="dashboard-icon text-success small-icon" />
                        <div>
                            <h6 className="fw-bold mb-0">Cultivos</h6>
                            <span className="dashboard-metric-number text-success">{cultivosCount}</span>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    <div className="dashboard-card-saas dashboard-metric-card" onClick={() => navigate("/tareas")}>
                        <FaTasks className="dashboard-icon text-warning small-icon" />
                        <div>
                            <h6 className="fw-bold mb-0">Tareas</h6>
                            <span className="dashboard-metric-number text-warning">{tareasCount}</span>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    <div className="dashboard-card-saas dashboard-metric-card" onClick={() => navigate("/calendario")}>
                        <FaCalendarAlt className="dashboard-icon text-danger small-icon" />
                        <div>
                            <h6 className="fw-bold mb-0">Calendario</h6>
                            <span className="dashboard-metric-number text-danger">{calendarioCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TODO LO DEMÁS IGUAL QUE TU ARCHIVO ORIGINAL */}
            {/* (Riesgo climático, alertas, eventos, carruseles, badges, etc.) */}

            {/* NUEVA CARD DE RIESGO CLIMÁTICO */}
            {highRiskEvents.length > 0 && (
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="dashboard-card-saas dashboard-risk-graph">

                            <h4 className="fw-bold mb-3">Riesgo climático reciente</h4>

                            <div className="risk-bars-container mb-3">
                                {highRiskEvents.map((ev) => (
                                    <div key={ev.id} className="risk-bar-row">
                                        <span className="risk-bar-label">
                                            {ev.plot_name || "Parcela desconocida"}
                                        </span>
                                        <div className="risk-bar">
                                            <div
                                                className="risk-bar-fill"
                                                data-width={ev.intensity * 100}
                                            ></div>
                                        </div>
                                        <span className="risk-bar-value">
                                            {(ev.intensity * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="risk-details-list">
                                {highRiskEvents.map((ev) => (
                                    <div key={ev.id} className="risk-detail-item">
                                        <div className="risk-detail-icon">
                                            {iconForEvent(ev.type)}
                                        </div>

                                        <div className="risk-detail-content">
                                            <strong>
                                                {ev.plot_name ? `${ev.plot_name} — ` : ""}
                                                {ev.type.replace("_", " ")}
                                            </strong>
                                            <br />
                                            <small className="text-muted">
                                                {formatFecha(ev.date)}
                                            </small>
                                            <br />
                                            <span className="badge bg-danger mt-1">
                                                Riesgo alto — Intensidad {ev.intensity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* ALERTAS + EVENTOS */}
            <div className="row g-4 dashboard-main-row">

                {/* ALERTAS AGRÍCOLAS */}
                <div className="col-12 col-lg-6">
                    <div className="dashboard-card-saas dashboard-card-alerts">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h4 className="fw-bold mb-0">Alertas agrícolas de la semana</h4>
                            <div className="dashboard-nav-buttons">
                                <button className="btn btn-sm btn-outline-secondary me-1" onClick={handlePrevAlert} disabled={alertIndex === 0}>‹</button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={handleNextAlert} disabled={alertIndex + ITEMS_PER_PAGE >= weeklyAlerts.length}>›</button>
                            </div>
                        </div>

                        {loadingAlerts && <p>Cargando alertas...</p>}

                        {!loadingAlerts && weeklyAlerts.length === 0 && (
                            <p className="text-muted mb-0">No hay alertas agrícolas para los próximos días.</p>
                        )}

                        {!loadingAlerts && weeklyAlerts.length > 0 && (
                            <div>
                                {visibleAlerts.map((alert, idx) => (
                                    <div key={`${alert.plot_id}-${alert.cultivo_parcela_id}-${alert.fecha}-${idx}`} className="dashboard-item-row dashboard-item-bg-alert">
                                        <div className="dashboard-item-icon">{iconForEvent(alert.tipo)}</div>

                                        <div className="dashboard-item-content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong>{alert.plot_name} — {alert.cultivo_tipo_nombre}</strong>
                                                <small className="text-muted">{formatFecha(alert.fecha)}</small>
                                            </div>
                                            <div className="mt-1">
                                                <span className={`badge ${badgeClassForLevel(alert.nivel)} me-2`}>{alert.tipo}</span>
                                                <span>{alert.mensaje}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* EVENTOS CLIMÁTICOS */}
                <div className="col-12 col-lg-6">
                    <div className="dashboard-card-saas dashboard-card-events">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h4 className="fw-bold mb-0">Eventos climáticos recientes</h4>
                            <div className="dashboard-nav-buttons">
                                <button
                                    className="btn btn-sm btn-outline-secondary me-1"
                                    onClick={handlePrevEvent}
                                    disabled={eventIndex === 0}
                                >
                                    ‹
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={handleNextEvent}
                                    disabled={eventIndex + ITEMS_PER_PAGE >= recentEvents.length}
                                >
                                    ›
                                </button>
                            </div>
                        </div>

                        {loadingClimate && <p>Cargando clima...</p>}

                        {!loadingClimate && recentEvents.length === 0 && (
                            <p className="text-muted mb-0">No hay eventos recientes.</p>
                        )}

                        {!loadingClimate && recentEvents.length > 0 && (
                            <div>
                                {visibleEvents.map((ev) => (
                                    <div
                                        key={ev.id}
                                        className="dashboard-item-row dashboard-item-bg-event"
                                    >
                                        <div className="dashboard-item-icon">
                                            {iconForEvent(ev.type)}
                                        </div>

                                        <div className="dashboard-item-content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong>
                                                    {ev.plot_name ? `${ev.plot_name} — ` : ""}
                                                    {ev.type.replace("_", " ")}
                                                </strong>
                                                <small className="text-muted">
                                                    {formatFecha(ev.date)}
                                                </small>
                                            </div>

                                            <div className="mt-1">
                                                <span
                                                    className={`badge ${ev.intensity > 0.7
                                                        ? "bg-danger"
                                                        : ev.intensity > 0.4
                                                            ? "bg-warning text-dark"
                                                            : "bg-secondary"
                                                        } me-2`}
                                                >
                                                    Intensidad: {ev.intensity.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
