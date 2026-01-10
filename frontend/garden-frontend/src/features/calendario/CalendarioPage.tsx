import { useEffect, useState } from "react";
import React from "react";
import { formatFecha } from "../../utils/formatFecha";

import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";

import type { EventoAgricola } from "./types";
import type { TareaAgricola } from "../tareas/types";

import { useTareasStore } from "../../store/tareasStore";

import "./calendario.css";

// -----------------------------
// TIPOS
// -----------------------------
type AlertaClimatica = {
    plot_id: number;
    plot_name: string;
    cultivo_id: number;
    cultivo_name: string;
    fecha: string;
    tipo: string;
    mensaje: string;
    nivel: "danger" | "warning" | "info";
};

// -----------------------------
// COLORES POR ESTADO
// -----------------------------
const getEstadoColor = (estado?: string) => {
    switch (estado) {
        case "pendiente":
            return "#fde047"; // amarillo
        case "en_progreso":
            return "#3b82f6"; // azul
        case "completada":
            return "#16a34a"; // verde
        default:
            return "#6b7280"; // gris
    }
};

export default function CalendarioPage() {
    const { tareas, loadTareas } = useTareasStore();

    const [alertas, setAlertas] = useState<AlertaClimatica[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [form, setForm] = useState<EventoAgricola>({
        titulo: "",
        fecha: "",
        tipo: "tarea",
        descripcion: "",
        estado: "pendiente",
    });

    // -----------------------------
    // CARGAR TAREAS
    // -----------------------------
    useEffect(() => {
        loadTareas();
    }, [loadTareas]);

    // -----------------------------
    // CARGAR ALERTAS CLIMÁTICAS
    // -----------------------------
    useEffect(() => {
        const loadAlertas = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/v1/clima/alertas-semana");
                const data = await res.json();
                setAlertas(data);
            } catch (err) {
                console.error("Error cargando alertas:", err);
            }
        };

        loadAlertas();
    }, []);

    // -----------------------------
    // TAREAS → EVENTOS
    // -----------------------------
    const eventosTareas: EventoAgricola[] = tareas
        .filter((t: TareaAgricola) => t.estado !== "completada")
        .map((t: TareaAgricola) => ({
            id: t.id,
            titulo: `${t.titulo} en: "${t.parcela?.name ?? "—"}"`,
            fecha: t.fecha,
            tipo: "tarea",
            descripcion: t.descripcion ?? "",
            estado: t.estado,
            color: getEstadoColor(t.estado),
        }));

    // -----------------------------
    // ALERTAS → EVENTOS
    // -----------------------------
    const eventosAlertas: EventoAgricola[] = alertas.map((a) => ({
        id: Number(`${a.plot_id}${a.cultivo_id}${a.fecha.replace(/-/g, "")}`),
        titulo: `${a.tipo} de ${a.cultivo_name} en parcela ${a.plot_name}`,
        fecha: a.fecha,
        tipo: "alerta",
        descripcion: a.mensaje,
        estado: "info",
        color:
            a.nivel === "danger"
                ? "#dc3545"
                : a.nivel === "warning"
                    ? "#f59e0b"
                    : "#0ea5e9",
    }));

    // -----------------------------
    // UNIR TAREAS + ALERTAS
    // -----------------------------
    const eventos = [...eventosTareas, ...eventosAlertas];

    // -----------------------------
    // HANDLERS
    // -----------------------------
    const handleSelectDate = (fecha: string) => {
        setForm({
            titulo: "",
            fecha,
            tipo: "tarea",
            descripcion: "",
            estado: "pendiente",
        });
        setModalOpen(true);
    };

    const handleSelectEvent = (ev: EventoAgricola) => {
        setForm(ev);
        setModalOpen(true);
    };

    const handleSubmit = () => {
        setModalOpen(false);
    };

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <div className="calendario-bg p-4">

            <h2 className="fw-bold mb-4 text-white">
                Calendario agrícola
            </h2>

            {/* LISTA DE TAREAS PENDIENTES */}
            <div className="bg-white bg-opacity-60 p-4 rounded shadow mb-4">

                {/* Encabezado con leyenda */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold">Tareas pendientes</h4>

                    <div className="leyenda-estados">
                        <div className="leyenda-item">
                            <span className="leyenda-color color-en-progreso"></span>
                            En Progreso
                        </div>

                        <div className="leyenda-item">
                            <span className="leyenda-color color-pendiente"></span>
                            Pendiente
                        </div>
                    </div>
                </div>

                {eventosTareas.length === 0 && (
                    <p className="text-gray-700">No hay tareas pendientes.</p>
                )}

                <ul className="list-group">
                    {eventosTareas.map((ev) => (
                        <li
                            key={ev.id}
                            className="list-group-item d-flex justify-content-between align-items-center cursor-pointer tarea-item"
                            onClick={() => handleSelectEvent(ev)}
                            style={
                                {
                                    "--tarea-color": ev.color,
                                    "--tarea-bg": ev.color + "33",
                                } as React.CSSProperties
                            }
                        >
                            <span>{ev.titulo}</span>
                            <span className="badge bg-primary">
                                {formatFecha(ev.fecha)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CALENDARIO */}
            <Calendar
                eventos={eventos}
                onSelectDate={handleSelectDate}
                onSelectEvent={handleSelectEvent}
            />

            {/* MODAL */}
            {modalOpen && (
                <EventModal
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}
