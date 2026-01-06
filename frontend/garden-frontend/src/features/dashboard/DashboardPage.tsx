import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCounter } from "./../hooks/useCounter";
import type { ClimateEvent } from "../parcelas/types";

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

    const loadCounts = useCallback(async () => {
        try {
            const [p, c, t] = await Promise.all([
                api.get("/plots"),
                api.get("/cultivos"),
                api.get("/tareas"),
            ]);

            type Tarea = {
                id: number;
                titulo: string;
                fecha: string;
                estado: string;
                descripcion?: string;
                parcela_id?: number | null;
                cultivo_id?: number | null;
            };

            const tareasPendientes = (t.data as Tarea[]).filter(
                (x) => x.estado !== "completada"
            ).length;

            setCounts({
                parcelas: p.data.length,
                cultivos: c.data.length,
                tareas: t.data.length,
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

    useEffect(() => {
        loadCounts();
        loadClimate();
    }, [loadCounts, loadClimate]);

    const parcelasCount = useCounter(counts.parcelas);
    const cultivosCount = useCounter(counts.cultivos);
    const tareasCount = useCounter(counts.tareas);
    const calendarioCount = useCounter(counts.calendario);

    const iconForEvent = (type: string) => {
        switch (type) {
            case "lluvia":
                return <WiRain size={40} color="#0d6efd" />;
            case "tormenta":
                return <WiStormShowers size={40} color="#6f42c1" />;
            case "granizo":
                return <WiSnow size={40} color="#20c997" />;
            case "ola_de_calor":
                return <WiThermometer size={40} color="#dc3545" />;
            case "helada":
                return <WiSnow size={40} color="#0dcaf0" />;
            case "viento_fuerte":
                return <WiStrongWind size={40} color="#198754" />;
            default:
                return <WiDaySunny size={40} />;
        }
    };

    const highRisk = recentEvents.filter((ev: ClimateEvent) => ev.intensity > 0.7).length;

    return (
        <div className="dashboard-bg">

            {/* 🔥 NUEVA FILA: Riesgo climático global */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-6">
                    <div className="dashboard-card-saas d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="fw-bold">Riesgo climático reciente</h4>
                            <p className="text-muted mb-0">
                                {highRisk === 0
                                    ? "No hay riesgos altos en los últimos días."
                                    : `Se han detectado ${highRisk} eventos de riesgo alto.`}
                            </p>
                        </div>

                        <div>
                            {highRisk > 0 ? (
                                <WiStormShowers size={60} color="#dc3545" />
                            ) : (
                                <WiDaySunny size={60} color="#198754" />
                            )}
                        </div>
                    </div>
                </div>

                {/* 🔥 Tarjeta de eventos recientes */}
                <div className="col-12 col-lg-6">
                    <div className="dashboard-card-saas">
                        <h4 className="fw-bold">Eventos climáticos recientes</h4>
                        {loadingClimate && <p>Cargando clima...</p>}

                        {!loadingClimate && recentEvents.length === 0 && (
                            <p className="text-muted">No hay eventos recientes.</p>
                        )}

                        {!loadingClimate && recentEvents.length > 0 && (
                            <div className="mt-3" style={{ maxHeight: "180px", overflowY: "auto" }}>
                                {recentEvents.map((ev: ClimateEvent) => (
                                    <div
                                        key={ev.id}
                                        className="d-flex align-items-center mb-2 p-2 rounded"
                                        style={{ background: "#f8f9fa" }}
                                    >
                                        <div className="me-3">{iconForEvent(ev.type)}</div>

                                        <div>
                                            <strong className="text-capitalize">
                                                {ev.type.replace("_", " ")}
                                            </strong>
                                            <br />
                                            <small className="text-muted">
                                                {new Date(ev.date).toLocaleDateString()}
                                            </small>
                                            <br />
                                            <span
                                                className={`badge bg-${ev.intensity > 0.7
                                                    ? "danger"
                                                    : ev.intensity > 0.4
                                                        ? "warning"
                                                        : "secondary"
                                                    }`}
                                            >
                                                Intensidad: {ev.intensity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔥 TUS TARJETAS ORIGINALES (sin tocar) */}
            <div className="row g-4">
                {/* Parcelas */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="dashboard-card-saas" onClick={() => navigate("/parcelas")}>
                        <FaMapMarkedAlt className="dashboard-icon text-primary" />
                        <h4 className="fw-bold mt-3">Parcelas</h4>
                        <p className="text-muted">Ver parcelas</p>
                        <div className="dashboard-counter text-primary">{parcelasCount}</div>
                    </div>
                </div>

                {/* Cultivos */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="dashboard-card-saas" onClick={() => navigate("/cultivos")}>
                        <GiPlantRoots className="dashboard-icon text-success" />
                        <h4 className="fw-bold mt-3">Cultivos</h4>
                        <p className="text-muted">Ver cultivos</p>
                        <div className="dashboard-counter text-success">{cultivosCount}</div>
                    </div>
                </div>

                {/* Tareas */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="dashboard-card-saas" onClick={() => navigate("/tareas")}>
                        <FaTasks className="dashboard-icon text-warning" />
                        <h4 className="fw-bold mt-3">Tareas</h4>
                        <p className="text-muted">Ver tareas</p>
                        <div className="dashboard-counter text-warning">{tareasCount}</div>
                    </div>
                </div>

                {/* Calendario */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="dashboard-card-saas" onClick={() => navigate("/calendario")}>
                        <FaCalendarAlt className="dashboard-icon text-danger" />
                        <h4 className="fw-bold mt-3">Calendario</h4>
                        <p className="text-muted">Ver calendario</p>
                        <div className="dashboard-counter text-danger">{calendarioCount}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
