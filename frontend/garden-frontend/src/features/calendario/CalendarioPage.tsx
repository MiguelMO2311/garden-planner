import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";
import {
    getEventos,
    createEvento,
    updateEvento,
    // deleteEvento,
} from "./api/calendarioApi";
import type { EventoAgricola } from "./types";

export default function CalendarioPage() {
    const [eventos, setEventos] = useState<EventoAgricola[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<EventoAgricola>({
        titulo: "",
        fecha: "",
        tipo: "tarea",
        descripcion: "",
    });

    const load = async () => {
        const res = await getEventos();
        setEventos(res.data);
    };

    useEffect(() => {
        const fetch = async () => {
            const res = await getEventos();
            setEventos(res.data);
        };

        fetch();
    }, []);

    const handleSelectDate = (fecha: string) => {
        setForm({ titulo: "", fecha, tipo: "tarea", descripcion: "" });
        setModalOpen(true);
    };

    const handleSelectEvent = (ev: EventoAgricola) => {
        setForm(ev);
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        if (form.id) {
            await updateEvento(form.id, form);
        } else {
            await createEvento(form);
        }

        setModalOpen(false);
        load();
    };

    return (
        <DashboardLayout>
            <h2 className="text-2xl font-bold mb-6">Calendario agrícola</h2>

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
        </DashboardLayout>
    );
}
