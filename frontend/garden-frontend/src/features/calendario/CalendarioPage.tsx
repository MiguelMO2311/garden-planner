import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";

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
        console.log("EVENTOS RECIBIDOS:", res.data);

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
        const fetch = async () => {
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

        fetch();
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
        if (form.id) {
            await updateEvento(form.id, form);
        } else {
            await createEvento(form);
        }

        setModalOpen(false);
        loadEventos();
    };

    return (
        <DashboardLayout>
            <div className="calendario-bg">
                <h2 className="text-2xl font-bold mb-6 text-white">
                    Calendario agrícola
                </h2>

                <Calendar
                    eventos={eventos}
                    onSelectDate={handleSelectDate}
                    onSelectEvent={handleSelectEvent}
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
        </DashboardLayout>
    );
}
