import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import rrulePlugin from "@fullcalendar/rrule";
import esLocale from "@fullcalendar/core/locales/es";

import type { EventoAgricola } from "../types";
import type { EventContentArg } from "@fullcalendar/core";

import "./calendar.css";

interface Props {
    eventos: EventoAgricola[];
    onSelectDate: (date: string) => void;
    onSelectEvent: (evento: EventoAgricola) => void;
}

export default function Calendar({ eventos, onSelectDate, onSelectEvent }: Props) {
    const mappedEvents = eventos.map((ev) => ({
        id: String(ev.id),
        title: ev.titulo,
        start: ev.fecha,
        backgroundColor: ev.color
            ? ev.color
            : ev.tipo === "riego"
                ? "#16a34a"
                : ev.tipo === "plaga"
                    ? "#dc2626"
                    : ev.tipo === "siembra"
                        ? "#ca8a04"
                        : ev.tipo === "cosecha"
                            ? "#ea580c"
                            : "#2563eb",
        borderColor: "transparent",
        extendedProps: {
            ...ev,
            icon:
                ev.tipo === "riego"
                    ? "💧"
                    : ev.tipo === "plaga"
                        ? "🐛"
                        : ev.tipo === "siembra"
                            ? "🌱"
                            : ev.tipo === "cosecha"
                                ? "🌾"
                                : "📌",
        },
    }));

    const renderEventContent = (info: EventContentArg) => {
        const icon = info.event.extendedProps.icon as string;
        return (
            <div className="fc-event-custom">
                <span className="mr-1">{icon}</span>
                <span>{info.event.title}</span>
            </div>
        );
    };

    return (
        <div className="fullcalendar-wrapper">
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                    rrulePlugin,
                ]}
                locale={esLocale}
                initialView="dayGridMonth"
                height="50vh"
                events={[
                    ...mappedEvents,
                    {
                        title: "Revisión semanal",
                        rrule: {
                            freq: "weekly",
                            byweekday: ["mo"],
                        },
                        backgroundColor: "#6b7280",
                        borderColor: "transparent",
                    },
                ]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                selectable={true}
                editable={true}
                eventResizableFromStart={true}
                eventContent={renderEventContent}
                dayMaxEvents={true}
                navLinks={true}
                expandRows={true}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                displayEventEnd={false}
                progressiveEventRendering={true}
                dateClick={(info) => onSelectDate(info.dateStr)}
                eventClick={(info) => {
                    const ev = info.event.extendedProps as EventoAgricola;
                    onSelectEvent(ev);
                }}
                eventDrop={(info) => {
                    const ev = info.event.extendedProps as EventoAgricola;
                    onSelectEvent({
                        ...ev,
                        fecha: info.event.startStr,
                    });
                }}
                eventResize={(info) => {
                    const ev = info.event.extendedProps as EventoAgricola;
                    onSelectEvent({
                        ...ev,
                        fecha: info.event.startStr,
                    });
                }}
                viewDidMount={() => {
                    document
                        .querySelector(".fc-view-harness")
                        ?.classList.add("fade-in");
                }}
            />
        </div>
    );
}
