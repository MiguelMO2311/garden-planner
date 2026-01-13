// 🔥 PARCELA DETAIL PAGE — VERSIÓN UX MEJORADA
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { useTareasStore } from "../../store/tareasStore";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../../api/axios";
import {
    getClimateByPlot,
    getRealWeather,
    getRecommendationsByPlot
} from "./api/parcelasApi";

import type { AgroRecommendation } from "./types";
import { createTaskFromRecommendation } from "./../tareas/api/tareasApi";

import MapaVista from "../../components/MapaVista";
import GraficoHumedad from "../../components/GraficoHumedad";
import GraficoViento from "../../components/GraficoViento";
import GraficoTemperatura from "../../components/GraficoTemperatura";

import {
    WiRain,
    WiDaySunny,
    WiSnow,
    WiStrongWind,
    WiStormShowers,
    WiThermometer,
} from "react-icons/wi";

import "./parcelas.css";

// -------------------------------------------------------------
// ICONOS POR TIPO DE RECOMENDACIÓN
// -------------------------------------------------------------
const ICONOS_RECOMENDACION: Record<string, string> = {
    lluvia: "🌧️",
    lluvia_fuerte: "⛈️",
    tormenta: "🌩️",
    helada: "❄️",
    calor: "🔥",
    viento: "💨",
    plaga: "🐛",
    riego: "💧",
    fertilizacion: "🧪",
    siembra: "🌱",
    cosecha: "🧺",
    poda: "✂️",
    general: "📌",
};

// -------------------------------------------------------------
// PRIORIDAD DE RIESGO PARA ORDENAR
// -------------------------------------------------------------
const PRIORIDAD_RIESGO: Record<string, number> = {
    danger: 1,
    warning: 2,
    info: 3,
};

// -------------------------------------------------------------
// ESTILOS POR PRIORIDAD
// -------------------------------------------------------------
const ESTILOS_RIESGO: Record<string, string> = {
    danger: "rec-item rec-danger",
    warning: "rec-item rec-warning",
    info: "rec-item rec-info",
};

// -------------------------------------------------------------
// Función auxiliar para obtener icono
// -------------------------------------------------------------
const getIconoRecomendacion = (tipo?: string) => {
    if (!tipo) return "📌";
    const key = tipo.toLowerCase().replace(/\s+/g, "_");
    return ICONOS_RECOMENDACION[key] ?? "📌";
};

// -------------------------------------------------------------
// Tipos
// -------------------------------------------------------------
interface Parcela {
    id: number;
    name: string;
    location: string | null;
    soil_type: string | null;
    size_m2: number | null;
    lat: number | null;
    lng: number | null;
}

interface ClimateEvent {
    id: number;
    plot_id: number;
    type: string;
    date: string;
    description: string;
    intensity: number;
}

interface WeatherHour {
    dt: number;
    temp: number;
    humidity: number;
    wind_speed: number;
}

interface WeatherDaily {
    dt: number;
    temp: { min: number; max: number };
    humidity: number;
    wind_speed: number;
    weather?: { description: string }[];
    pop?: number;
}

interface OpenWeatherResponse {
    current: {
        temp: number;
        humidity: number;
        wind_speed: number;
        weather?: { description: string }[];
    };
    hourly?: WeatherHour[];
    daily?: WeatherDaily[];
    alerts?: { event: string }[];
}

// -------------------------------------------------------------
// Componente principal
// -------------------------------------------------------------
export default function ParcelaDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [parcela, setParcela] = useState<Parcela | null>(null);
    const [climateEvents, setClimateEvents] = useState<ClimateEvent[]>([]);
    const [realWeather, setRealWeather] = useState<OpenWeatherResponse | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [recommendations, setRecommendations] = useState<
        (AgroRecommendation & { tarea_creada?: boolean })[]
    >([]);

    const [recError, setRecError] = useState<string | null>(null);

    const { tareas, loadTareas } = useTareasStore();

    useEffect(() => {
        if (!recommendations.length || !tareas.length) return;

        setRecommendations(prev =>
            prev.map(rec => {
                const yaExiste = tareas.some(t =>
                    t.parcela_id === rec.plot_id &&
                    t.descripcion?.trim() === rec.message.trim()
                );

                return yaExiste
                    ? { ...rec, tarea_creada: true }
                    : rec;
            })
        );
    }, [tareas, recommendations]);

    // -------------------------------------------------------------
    // Cargar datos
    // -------------------------------------------------------------
    useEffect(() => {
        if (!id) {
            setLoadError("ID de parcela no válido");
            setLoading(false);
            return;
        }

        async function loadData(): Promise<void> {
            try {
                const parcelaRes = await api.get<Parcela>(`/plots/${id}`);
                setParcela(parcelaRes.data);

                const eventos = await getClimateByPlot(Number(id));
                setClimateEvents(eventos);

                // Cargar clima real sin bloquear la página si falla
                getRealWeather(Number(id))
                    .then(clima => setRealWeather(clima))
                    .catch(() => {
                        // No hacemos nada: simplemente no habrá datos de clima
                    });

                // Cargar recomendaciones
                getRecommendationsByPlot(Number(id))
                    .then(recs => setRecommendations(recs))
                    .catch(() => {
                        setRecError("No se pudieron cargar las recomendaciones agrícolas.");
                    });

            } catch (error: unknown) {
                console.error(error);

                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setLoadError("Parcela no encontrada.");
                } else {
                    setLoadError("Error al cargar la parcela.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    // -------------------------------------------------------------
    // Ordenar recomendaciones
    // -------------------------------------------------------------
    const recomendacionesOrdenadas = [...recommendations].sort((a, b) => {
        if (a.plot_id !== b.plot_id) return a.plot_id - b.plot_id;

        const prioA = PRIORIDAD_RIESGO[a.climate_risk] ?? 99;
        const prioB = PRIORIDAD_RIESGO[b.climate_risk] ?? 99;
        if (prioA !== prioB) return prioA - prioB;

        return a.climate_event_type.localeCompare(b.climate_event_type);
    });

    // -------------------------------------------------------------
    // Iconos para eventos
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // Carrusel independiente para recomendaciones
    // -------------------------------------------------------------
    const [recIndex, setRecIndex] = useState(0);

    useEffect(() => {
        if (recomendacionesOrdenadas.length === 0) return;

        const interval = setInterval(() => {
            setRecIndex(prev =>
                prev + 1 < recomendacionesOrdenadas.length ? prev + 1 : 0
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [recomendacionesOrdenadas]);

    // -------------------------------------------------------------
    // Carrusel independiente para eventos climáticos
    // -------------------------------------------------------------
    const [eventIndex, setEventIndex] = useState(0);

    useEffect(() => {
        if (climateEvents.length === 0) return;

        const interval = setInterval(() => {
            setEventIndex(prev =>
                prev + 1 < climateEvents.length ? prev + 1 : 0
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [climateEvents]);

    // -------------------------------------------------------------
    // Crear tarea desde recomendación
    // -------------------------------------------------------------
    async function handleCreateTask(rec: AgroRecommendation & { tarea_creada?: boolean }) {
        try {
            await createTaskFromRecommendation({
                plot_id: rec.plot_id,
                recommendation_type: rec.recommendation_type,
                message: rec.message,
                fecha: new Date().toISOString().split("T")[0]
            });

            await loadTareas();

            alert("Tarea creada correctamente");

            setRecommendations(prev =>
                prev.map(r =>
                    r === rec ? { ...r, tarea_creada: true } : r
                )
            );

        } catch (err) {
            console.error(err);
            alert("Error al crear la tarea");
        }
    }

    // -------------------------------------------------------------
    // Renderizado
    // -------------------------------------------------------------
    if (loading) return <p className="mt-4">Cargando datos...</p>;

    if (loadError) {
        return (
            <div className="parcelas-card dashboard-card-parcelas p-4 rounded-lg">
                <p className="text-danger mb-3">{loadError}</p>
                <button
                    className="parcelas-btn-warning"
                    onClick={() => navigate("/parcelas")}
                >
                    Volver
                </button>
            </div>
        );
    }

    if (!parcela) {
        return (
            <div className="parcelas-card dashboard-card-parcelas p-4 rounded-lg">
                <p className="mb-3">Parcela no encontrada.</p>
                <button
                    className="parcelas-btn-warning"
                    onClick={() => navigate("/parcelas")}
                >
                    Volver
                </button>
            </div>
        );
    }

    return (
        <>
            {/* ------------------------------------------------------ */}
            {/* ENCABEZADO */}
            {/* ------------------------------------------------------ */}
            <div className="parcelas-card dashboard-card-parcelas p-4 rounded-lg mb-4 d-flex justify-content-between align-items-center">
                <h2 className="parcelas-title mb-0">{parcela.name}</h2>

                <div className="d-flex gap-2">
                    <button
                        className="parcelas-btn-warning"
                        onClick={() => navigate("/parcelas")}
                    >
                        Volver
                    </button>

                    <Link
                        to={`/parcelas/${parcela.id}/editar`}
                        className="parcelas-btn-guardar"
                    >
                        Editar parcela
                    </Link>
                </div>
            </div>

            {/* ------------------------------------------------------ */}
            {/* MAPA (100% ANCHO) */}
            {/* ------------------------------------------------------ */}
            <div className="parcelas-card dashboard-card-parcelas p-16 rounded-lg mb-4">
                <h5 className="parcelas-label mb-2">Ubicación en el mapa</h5>

                {parcela.lat != null && parcela.lng != null ? (
                    <MapaVista lat={parcela.lat} lng={parcela.lng} />
                ) : (
                    <p className="text-muted mb-0">Esta parcela no tiene coordenadas asignadas.</p>
                )}
            </div>

            {/* ------------------------------------------------------ */}
            {/* GRID 4 CARDS (1/4 PANTALLA CADA UNA) */}
            {/* ------------------------------------------------------ */}
            <div className="grid-cards-4 mb-4">
                {/* Clima actual */}
                <div className="parcelas-card dashboard-card-parcelas p-3 rounded-lg">
                    <h5 className="parcelas-label mb-2">Clima actual</h5>

                    {realWeather ? (
                        <>
                            <p><strong>Temperatura:</strong> {realWeather.current.temp} °C</p>
                            <p><strong>Humedad:</strong> {realWeather.current.humidity} %</p>
                            <p><strong>Viento:</strong> {realWeather.current.wind_speed} km/h</p>

                            <p className="text-capitalize">
                                <strong>Condición:</strong>{" "}
                                {realWeather.current.weather?.[0]?.description}
                            </p>

                            {realWeather.alerts && realWeather.alerts.length > 0 && (
                                <div className="alert alert-danger mt-3 mb-0">
                                    <strong>⚠️ Alerta meteorológica:</strong>{" "}
                                    {realWeather.alerts[0].event}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-muted">Sin datos</p>
                    )}
                </div>

                {/* Temperatura */}
                <div className="parcelas-card dashboard-card-parcelas p-3 rounded-lg">
                    <h5 className="parcelas-label mb-2">Temperatura (24h)</h5>
                    {realWeather?.hourly ? (
                        <GraficoTemperatura
                            hours={realWeather.hourly.slice(0, 24).map(h => {
                                let timestamp: number | null = null;

                                if (typeof h.dt === "string") {
                                    const parsed = Date.parse(h.dt);
                                    timestamp = isNaN(parsed) ? null : parsed;
                                } else if (typeof h.dt === "number") {
                                    timestamp = h.dt < 1e12 ? h.dt * 1000 : h.dt;
                                }

                                return {
                                    dt: timestamp ? new Date(timestamp) : null,
                                    temp: h.temp,
                                };
                            })}
                        />
                    ) : (
                        <p className="text-muted">Sin datos</p>
                    )}
                </div>

                {/* Humedad */}
                <div className="parcelas-card dashboard-card-parcelas p-3 rounded-lg">
                    <h5 className="parcelas-label mb-2">Humedad (24h)</h5>
                    {realWeather?.hourly ? (
                        <GraficoHumedad
                            hours={realWeather.hourly.slice(0, 24).map(h => {
                                let timestamp: number | null = null;

                                if (typeof h.dt === "string") {
                                    const parsed = Date.parse(h.dt);
                                    timestamp = isNaN(parsed) ? null : parsed;
                                } else if (typeof h.dt === "number") {
                                    timestamp = h.dt < 1e12 ? h.dt * 1000 : h.dt;
                                }

                                return {
                                    dt: timestamp ? new Date(timestamp) : null,
                                    humidity: h.humidity,
                                };
                            })}
                        />
                    ) : (
                        <p className="text-muted">Sin datos</p>
                    )}
                </div>

                {/* Viento */}
                <div className="parcelas-card dashboard-card-parcelas p-3 rounded-lg">
                    <h5 className="parcelas-label mb-2">Viento (24h)</h5>
                    {realWeather?.hourly ? (
                        <GraficoViento
                            hours={realWeather.hourly.slice(0, 24).map(h => {
                                let timestamp: number | null = null;

                                if (typeof h.dt === "string") {
                                    const parsed = Date.parse(h.dt);
                                    timestamp = isNaN(parsed) ? null : parsed;
                                } else if (typeof h.dt === "number") {
                                    timestamp = h.dt < 1e12 ? h.dt * 1000 : h.dt;
                                }

                                return {
                                    dt: timestamp ? new Date(timestamp) : null,
                                    wind_speed: h.wind_speed,
                                };
                            })}
                        />
                    ) : (
                        <p className="text-muted">Sin datos</p>
                    )}
                </div>
            </div>

            {/* ------------------------------------------------------ */}
            {/* PREDICCIÓN 7 DÍAS */}
            {/* ------------------------------------------------------ */}
            {realWeather?.daily && realWeather.daily.length > 0 && (
                <div className="parcelas-card dashboard-card-parcelas p-4 rounded-lg mb-4">
                    <h5 className="parcelas-label mb-3">Predicción de Temperatura en los próximos 7 días</h5>

                    <div className="row g-3">
                        {realWeather.daily.slice(1, 8).map((day, index) => {
                            let timestamp: number | null = null;

                            if (typeof day.dt === "string") {
                                const parsed = Date.parse(day.dt);
                                timestamp = isNaN(parsed) ? null : parsed;
                            } else if (typeof day.dt === "number") {
                                timestamp = day.dt < 1e12 ? day.dt * 1000 : day.dt;
                            }

                            let dateLabel = "Fecha inválida";

                            if (timestamp && !isNaN(timestamp)) {
                                const date = new Date(timestamp);
                                dateLabel = date.toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "short",
                                });
                            }

                            const description = day.weather?.[0]?.description ?? "";
                            const pop = day.pop != null ? Math.round(day.pop * 100) : null;

                            return (
                                <div key={index} className="col-md-6 col-lg-3">
                                    <div className="card h-100 border-0 bg-light">
                                        <div className="card-body">
                                            <h6 className="fw-bold mb-1">{dateLabel}</h6>

                                            <p className="mb-1 text-capitalize">{description}</p>

                                            <p className="mb-1">
                                                <strong>Máx:</strong> {Math.round(day.temp.max)} °C ·{" "}
                                                <strong>Mín:</strong> {Math.round(day.temp.min)} °C
                                            </p>

                                            {pop !== null && (
                                                <p className="mb-0">
                                                    <strong>Lluvia:</strong> {pop}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------ */}
            {/* SUGERENCIAS AGRÍCOLAS */}
            {/* ------------------------------------------------------ */}
            <div className="parcelas-card dashboard-card-parcelas p-4 rounded-lg mb-4">
                <h5 className="parcelas-label mb-2">Sugerencias agrícolas</h5>

                {recError && <p className="text-danger mb-0">{recError}</p>}

                {recommendations.length === 0 && !recError && (
                    <p className="text-muted mb-0">No hay recomendaciones para esta parcela.</p>
                )}

                {recommendations.length > 0 && (
                    <div className="alertas-carousel">
                        <div
                            className="alertas-carousel-inner"
                            style={{
                                transform: `translateY(-${recIndex * 160}px)`
                            }}
                        >
                            {recomendacionesOrdenadas.map(
                                (rec: AgroRecommendation & { tarea_creada?: boolean }, index) => (
                                    <div
                                        key={index}
                                        className={ESTILOS_RIESGO[rec.climate_risk] ?? "rec-item"}
                                        style={{ height: "160px", padding: "12px" }}
                                    >
                                        <strong className="rec-type">
                                            {getIconoRecomendacion(rec.recommendation_type)}{" "}
                                            {rec.recommendation_type}
                                        </strong>

                                        <p className="rec-message">{rec.message}</p>

                                        <small className="text-muted d-block mb-2">
                                            Evento: {rec.climate_event_type} ({rec.climate_risk})
                                            — Cultivo: {rec.cultivo}
                                            {rec.dias_desde_siembra != null &&
                                                ` — Día ${rec.dias_desde_siembra} desde siembra`}
                                        </small>

                                        <button
                                            className="parcelas-btn-guardar mt-2"
                                            onClick={() => handleCreateTask(rec)}
                                            disabled={rec.tarea_creada}
                                        >
                                            {rec.tarea_creada ? "Tarea creada" : "Crear tarea"}
                                        </button>

                                        {rec.tarea_creada && (
                                            <small className="text-success ms-2">
                                                ✓ Ya convertida en tarea
                                            </small>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ------------------------------------------------------ */}
            {/* EVENTOS CLIMÁTICOS */}
            {/* ------------------------------------------------------ */}
            <div className="parcelas-card dashboard-card-parcelas p-4 rounded-lg mb-4">
                <h3 className="parcelas-label mb-3">Eventos climáticos</h3>

                {climateEvents.length === 0 && (
                    <p className="mb-0">No hay eventos climáticos registrados para esta parcela.</p>
                )}

                {climateEvents.length > 0 && (
                    <div className="alertas-carousel">
                        <div
                            className="alertas-carousel-inner"
                            style={{
                                transform: `translateY(-${eventIndex * 160}px)`
                            }}
                        >
                            {climateEvents.map(ev => (
                                <div
                                    key={ev.id}
                                    className="rec-item rec-info"
                                    style={{ height: "160px", padding: "12px" }}
                                >
                                    <div className="d-flex align-items-start gap-3">
                                        <div>{iconForEvent(ev.type)}</div>

                                        <div>
                                            <h5 className="card-title text-capitalize mb-1">
                                                {ev.type.replace("_", " ")}
                                            </h5>

                                            <small className="text-muted d-block mb-1">
                                                {new Date(ev.date).toLocaleDateString()}
                                            </small>

                                            <p className="mt-1 mb-2">{ev.description}</p>

                                            <span
                                                className={`badge bg-${ev.intensity > 0.7
                                                    ? "danger"
                                                    : ev.intensity > 0.4
                                                        ? "warning"
                                                        : "secondary"
                                                    }`}
                                            >
                                                Intensidad: {Number(ev.intensity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
