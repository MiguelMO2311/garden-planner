// src/features/parcelas/ParcelaDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../../api/axios";
import { getClimateByPlot, getRealWeather } from "./api/parcelasApi";

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

// -----------------------------
// Tipos
// -----------------------------
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

// -----------------------------
// Componente principal
// -----------------------------
export default function ParcelaDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [parcela, setParcela] = useState<Parcela | null>(null);
    const [climateEvents, setClimateEvents] = useState<ClimateEvent[]>([]);
    const [realWeather, setRealWeather] = useState<OpenWeatherResponse | null>(null);

    const [weatherError, setWeatherError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // -----------------------------
    // Cargar datos
    // -----------------------------
    useEffect(() => {
        if (!id) {
            setLoadError("ID de parcela no válido");
            setLoading(false);
            return;
        }

        async function loadData(): Promise<void> {
            try {
                // 1) Detalle de parcela
                const parcelaRes = await api.get<Parcela>(`/plots/${id}`);
                setParcela(parcelaRes.data);

                // 2) Eventos climáticos simulados
                const eventos = await getClimateByPlot(Number(id));
                setClimateEvents(eventos);

                // 3) Clima real
                try {
                    const clima = await getRealWeather(Number(id));
                    setRealWeather(clima);
                } catch {
                    setWeatherError("No se pudo cargar el clima real.");
                }
            } catch (error: unknown) {
                console.error(error);

                // Type guard oficial de Axios
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

    // -----------------------------
    // Iconos para eventos
    // -----------------------------
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

    // -----------------------------
    // Renderizado
    // -----------------------------
    if (loading) return <p className="mt-4">Cargando datos...</p>;

    if (loadError) {
        return (
            <div className="parcelas-bg">
                <div className="parcelas-card">
                    <p className="text-danger mb-3">{loadError}</p>
                    <button className="btn btn-secondary" onClick={() => navigate("/parcelas")}>
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    if (!parcela) {
        return (
            <div className="parcelas-bg">
                <div className="parcelas-card">
                    <p className="mb-3">Parcela no encontrada.</p>
                    <button className="btn btn-secondary" onClick={() => navigate("/parcelas")}>
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="parcelas-bg">

            {/* Encabezado */}
            <div className="parcelas-card mb-4 d-flex justify-content-between align-items-center">
                <h2 className="parcelas-title mb-0">{parcela.name}</h2>

                <div className="d-flex gap-2">
                    <button className="btn btn-secondary" onClick={() => navigate("/parcelas")}>
                        Volver
                    </button>

                    <Link to={`/parcelas/${parcela.id}/editar`} className="btn btn-primary">
                        Editar parcela
                    </Link>
                </div>
            </div>

            {/* Información general */}
            <div className="parcelas-card">
                <h5 className="card-title">Información general</h5>

                <p><strong>Ubicación:</strong> {parcela.location || "Sin especificar"}</p>
                <p><strong>Tamaño:</strong> {parcela.size_m2 ?? "-"} m²</p>
                <p><strong>Tipo de suelo:</strong> {parcela.soil_type || "-"}</p>
            </div>

            {/* Mapa */}
            <div className="parcelas-card">
                <h5 className="card-title">Ubicación en el mapa</h5>

                {parcela.lat != null && parcela.lng != null ? (
                    <MapaVista lat={parcela.lat} lng={parcela.lng} />
                ) : (
                    <p className="text-muted mb-0">Esta parcela no tiene coordenadas asignadas.</p>
                )}
            </div>

            {/* Clima actual */}
            {realWeather && (
                <div className="parcelas-card">
                    <h5 className="card-title">Clima actual</h5>

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
                </div>
            )}

            {weatherError && (
                <div className="parcelas-card">
                    <p className="text-danger mb-0">{weatherError}</p>
                </div>
            )}

            {/* Gráficos por horas */}
            {realWeather?.hourly && realWeather.hourly.length > 0 && (
                <>
                    {/* TEMPERATURA */}
                    <div className="parcelas-card">
                        <h5 className="card-title">Temperatura por horas (24h)</h5>
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
                                    temp: h.temp,          // 👈 CORRECTO
                                };
                            })}
                        />
                    </div>

                    {/* HUMEDAD */}
                    <div className="parcelas-card">
                        <h5 className="card-title">Humedad por horas (24h)</h5>
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
                                    humidity: h.humidity,  // 👈 CORRECTO
                                };
                            })}
                        />
                    </div>

                    {/* VIENTO */}
                    <div className="parcelas-card">
                        <h5 className="card-title">Viento por horas (24h)</h5>
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
                                    wind_speed: h.wind_speed, // 👈 CORRECTO
                                };
                            })}
                        />
                    </div>
                </>
            )}

            {/* Predicción 7 días */}
            {realWeather?.daily && realWeather.daily.length > 0 && (
                <div className="parcelas-card">
                    <h5 className="card-title">Predicción próximos 7 días</h5>

                    <div className="row g-3">
                        {realWeather.daily.slice(1, 8).map((day, index) => {


                            let timestamp: number | null = null;

                            // --- dt puede ser string ISO o número ---
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

                                            {/* Fecha */}
                                            <h6 className="fw-bold mb-1">{dateLabel}</h6>

                                            {/* Descripción */}
                                            <p className="mb-1 text-capitalize">{description}</p>

                                            {/* Temperaturas */}
                                            <p className="mb-1">
                                                <strong>Máx:</strong> {Math.round(day.temp.max)} °C ·{" "}
                                                <strong>Mín:</strong> {Math.round(day.temp.min)} °C
                                            </p>

                                            {/* Probabilidad de lluvia */}
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

            {/* Eventos climáticos simulados */}
            <div className="parcelas-card">
                <h3 className="card-title mb-3">Eventos climáticos</h3>

                {climateEvents.length === 0 && (
                    <p className="mb-0">No hay eventos climáticos registrados para esta parcela.</p>
                )}

                {climateEvents.length > 0 && (
                    <div className="row g-3">
                        {climateEvents.map(ev => (
                            <div key={ev.id} className="col-md-6 col-lg-4">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body d-flex align-items-start gap-3">
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
                                                Intensidad: {ev.intensity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
