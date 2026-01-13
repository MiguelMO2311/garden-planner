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
    const [weeklyAlerts, setWeeklyAlerts] = useState<WeeklyAlert[]>([]);

    const [alertIndex, setAlertIndex] = useState(0);
    const [eventIndex, setEventIndex] = useState(0);

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

    useEffect(() => {
        const fetchAll = async () => {
            await loadCounts();
            await loadClimate();
            await loadWeeklyAlerts();
        };

        fetchAll();
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
    /* CARRUSEL AUTOMÁTICO (2 ITEMS VISIBLES, LOOP INFINITO)  */
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

    return (
        <div className="dashboard-bg">

            {/* TARJETAS PEQUEÑAS */}
            <div className="row g-3 mb-3">

                <div className="col-6 col-lg-3">
                    <div
                        className="dashboard-card-saas dashboard-card-parcelas"
                        onClick={() => navigate("/parcelas")}
                    >
                        <FaMapMarkedAlt className="dashboard-icon text-primary" />
                        <h6 className="fw-bold mb-0 mt-2">Parcelas</h6>
                        <span className="dashboard-counter text-primary">{parcelasCount}</span>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    <div
                        className="dashboard-card-saas dashboard-card-cultivos"
                        onClick={() => navigate("/cultivos-parcela")}
                    >
                        <GiPlantRoots className="dashboard-icon text-success" />
                        <h6 className="fw-bold mb-0 mt-2">Cultivos</h6>
                        <span className="dashboard-counter text-success">{cultivosCount}</span>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    <div
                        className="dashboard-card-saas dashboard-card-tareas"
                        onClick={() => navigate("/tareas")}
                    >
                        <FaTasks className="dashboard-icon text-warning" />
                        <h6 className="fw-bold mb-0 mt-2">Tareas</h6>
                        <span className="dashboard-counter text-warning">{tareasCount}</span>
                    </div>
                </div>

                <div className="col-6 col-lg-3">
                    <div
                        className="dashboard-card-saas dashboard-card-calendario"
                        onClick={() => navigate("/calendario")}
                    >
                        <FaCalendarAlt className="dashboard-icon text-danger" />
                        <h6 className="fw-bold mb-0 mt-2">Calendario</h6>
                        <span className="dashboard-counter text-danger">{calendarioCount}</span>
                    </div>
                </div>

            </div>

            {/* ALERTAS + EVENTOS (CARDS PARALELAS) */}
            <div className="row g-4 dashboard-cards-row">

                {/* ALERTAS AGRÍCOLAS */}
                <div className="col-12 col-lg-6">
                    <div className="dashboard-card-saas dashboard-card-alerts">

                        <h4 className="fw-bold mb-3">Alertas agrícolas de la semana</h4>

                        {weeklyAlerts.length === 0 && (
                            <p className="text-muted mb-0">No hay alertas agrícolas para los próximos días.</p>
                        )}

                        {weeklyAlerts.length === 1 && (
                            <div className="dashboard-carousel-item dashboard-item-bg-alert">
                                <div className="dashboard-item-icon">
                                    {iconForEvent(weeklyAlerts[0].tipo)}
                                </div>
                                <div className="dashboard-item-content">
                                    <div className="d-flex justify-content-between">
                                        <strong>{weeklyAlerts[0].plot_name} — {weeklyAlerts[0].cultivo_tipo_nombre}</strong>
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
                                    style={{
                                        transform: `translateY(-${alertIndex * 90}px)`
                                    }}
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
                </div>

                {/* EVENTOS CLIMÁTICOS */}
                <div className="col-12 col-lg-6">
                    <div className="dashboard-card-saas dashboard-card-events">

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
                                    style={{
                                        transform: `translateY(-${eventIndex * 90}px)`
                                    }}
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
        </div>
    );
}
