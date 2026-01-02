import { useEffect, useRef } from "react";
import "./calendar.css";
import type { EventoAgricola } from "../types";

interface CalendarProps {
    eventos: EventoAgricola[];
    onSelectDate: (date: string) => void;
    onSelectEvent: (evento: EventoAgricola) => void;
}

export default function Calendar({
    eventos,
    onSelectDate,
    onSelectEvent,
}: CalendarProps) {
    const calendarRef = useRef<HTMLDivElement | null>(null);

    // Iconos según tipo de evento
    const getIcon = (tipo: string) => {
        switch (tipo) {
            case "riego":
                return "💧";
            case "plaga":
                return "🐛";
            case "siembra":
                return "🌱";
            case "cosecha":
                return "🌾";
            case "tarea":
                return "📌";
            default:
                return "📅";
        }
    };

    // Colores según estado real
    const getEstadoColor = (estado: string | undefined) => {
        switch (estado) {
            case "pendiente":
                return "#facc15"; // amarillo
            case "en_progreso":
                return "#3b82f6"; // azul
            case "completada":
                return "#16a34a"; // verde
            default:
                return "#6b7280"; // gris
        }
    };

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (!calendarEl) return;

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            locale: "es",
            height: "50vh",
            selectable: true,
            editable: true,
            eventResizableFromStart: true,
            dayMaxEvents: true,
            navLinks: true,
            expandRows: true,
            slotMinTime: "06:00:00",
            slotMaxTime: "22:00:00",

            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            },

            events: eventos.map((ev: EventoAgricola) => ({
                id: String(ev.id),
                title: ev.titulo,
                start: ev.fecha,
                backgroundColor: getEstadoColor(ev.estado ?? "Pendiente"),
                borderColor: "transparent",
                extendedProps: ev,
            })),

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            eventContent: (arg: any) => {
                const ev = arg.event.extendedProps as EventoAgricola;
                const icon = getIcon(ev.tipo);

                return {
                    html: `
            <div class="fc-custom-event">
              <span class="fc-custom-icon">${icon}</span>
              <span class="fc-custom-title">${arg.event.title}</span>
            </div>
          `,
                };
            },

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dateClick(info: any) {
                onSelectDate(info.dateStr);
            },

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            eventClick(info: any) {
                onSelectEvent(info.event.extendedProps as EventoAgricola);
            },
        });

        calendar.render();
        return () => calendar.destroy();
    }, [eventos, onSelectDate, onSelectEvent]);

    return <div ref={calendarRef} className="fullcalendar-wrapper"></div>;
}
