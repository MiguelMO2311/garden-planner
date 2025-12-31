import { useEffect, useState } from "react";

import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";

import {
    getEventos,
    createEvento,
    updateEvento,
} from "./api/calendarioApi";

import type { EventoAgricola } from "./types";

import "./calendario.css";

// Tipo EXACTO que devuelve tu backend
type BackendEvent = {
    id: number;
    date: string;
    type: string;
    title: string;
    description?: string;
};

export default function CalendarioPage() {
    const [eventos, setEventos] = useState<EventoAgricola[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [form, setForm] = useState<EventoAgricola>({
        titulo: "",
        fecha: "",
        tipo: "tarea",
        descripcion: "",
        color: "#2563eb",
    });

    // -----------------------------
    // Cargar eventos desde el backend
    // -----------------------------
    const loadEventos = async () => {
        const res = await getEventos();

        const eventosTransformados = res.data.map((ev: BackendEvent) => ({
            id: ev.id,
            titulo: ev.title,
            fecha: ev.date,
            tipo: ev.type,
            descripcion: ev.description ?? "",
            color: "#2563eb",
        }));

        setEventos(eventosTransformados);
    };

    // Cargar eventos al montar
    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            if (!isMounted) return;
            await loadEventos();
        };

        run();

        return () => {
            isMounted = false;
        };
    }, []);

    // Crear evento desde un día del calendario
    const handleSelectDate = (fecha: string) => {
        setForm({
            titulo: "",
            fecha,
            tipo: "tarea",
            descripcion: "",
            color: "#2563eb",
        });
        setModalOpen(true);
    };

    // Editar evento existente
    const handleSelectEvent = (ev: EventoAgricola) => {
        setForm(ev);
        setModalOpen(true);
    };

    // Guardar (crear o actualizar)
    const handleSubmit = async () => {
        const payload = {
            ...form,
            color: form.color || "#2563eb",
            tipo: form.tipo || "tarea",
        };

        if (form.id) {
            await updateEvento(form.id, payload);
        } else {
            await createEvento(payload);
        }

        setModalOpen(false);
        loadEventos();
    };

    return (
        <div className="calendario-bg p-4">

            <h2 className="fw-bold mb-4 text-white">
                Calendario agrícola
            </h2>

            {/* ================================
                LISTA DE TAREAS PENDIENTES
            ================================= */}
            <div className="bg-white bg-opacity-60 p-4 rounded shadow mb-4">
                <h4 className="fw-bold mb-3">Tareas pendientes</h4>

                {eventos.length === 0 && (
                    <p className="text-gray-700">No hay tareas pendientes.</p>
                )}

                <ul className="list-group">
                    {eventos.map((ev) => (
                        <li
                            key={ev.id}
                            className="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
                            onClick={() => handleSelectEvent(ev)}
                        >
                            <span>{ev.titulo}</span>
                            <span className="badge bg-primary">{ev.fecha}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ================================
                CALENDARIO (20% MÁS PEQUEÑO)
            ================================= */}
            <Calendar
                eventos={eventos}
                onSelectDate={handleSelectDate}
                onSelectEvent={handleSelectEvent}  // <-- tamaño reducido
            />

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
