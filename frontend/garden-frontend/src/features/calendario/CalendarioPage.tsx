import { useEffect, useState } from "react";
import React from "react";
import { formatFecha } from "../../utils/formatFecha";

import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";

import type { EventoAgricola } from "./types";
import type { TareaAgricola } from "../tareas/types";

import { useTareasStore } from "../../store/tareasStore";

import "./calendario.css";

// Colores por estado (versión backend: minúsculas)
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

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<EventoAgricola>({
        titulo: "",
        fecha: "",
        tipo: "tarea",
        descripcion: "",
        estado: "pendiente",
    });

    useEffect(() => {
        loadTareas();
    }, [loadTareas]);

    // Convertimos tareas → eventos para el calendario
    const eventos: EventoAgricola[] = tareas
        .filter((t: TareaAgricola) => t.estado !== "completada")
        .map((t: TareaAgricola) => ({
            id: t.id,
            titulo: t.titulo,
            fecha: t.fecha,
            tipo: "tarea",
            descripcion: t.descripcion ?? "",
            estado: t.estado,
            color: getEstadoColor(t.estado),
        }));

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

                {eventos.length === 0 && (
                    <p className="text-gray-700">No hay tareas pendientes.</p>
                )}

                <ul className="list-group">
                    {eventos.map((ev) => (
                        <li
                            key={ev.id}
                            className="list-group-item d-flex justify-content-between align-items-center cursor-pointer tarea-item"
                            onClick={() => handleSelectEvent(ev)}
                            style={{ "--tarea-color": ev.color, "--tarea-bg": ev.color + "33" } as React.CSSProperties}
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
