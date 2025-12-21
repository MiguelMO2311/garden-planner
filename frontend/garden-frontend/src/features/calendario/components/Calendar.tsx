import type { EventoAgricola } from "../types";
import "./calendar.css";


interface Props {
    eventos: EventoAgricola[];
    onSelectDate: (date: string) => void;
    onSelectEvent: (evento: EventoAgricola) => void;
}

export default function Calendar({ eventos, onSelectDate, onSelectEvent }: Props) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        days.push(d);
    }

    const eventosPorDia = (dia: number) => {
        const fecha = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            dia
        ).padStart(2, "0")}`;

        return eventos.filter((e) => e.fecha === fecha);
    };

    return (
        <div className="grid grid-cols-7 gap-2">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                <div key={d} className="text-center font-semibold">
                    {d}
                </div>
            ))}

            {days.map((dia, i) => (
                <div
                    key={i}
                    className="border rounded p-2 h-24 cursor-pointer bg-white hover:bg-gray-100"
                    onClick={() => dia && onSelectDate(
                        `${year}-${String(month + 1).padStart(2, "0")}-${String(
                            dia
                        ).padStart(2, "0")}`
                    )}
                >
                    {dia && <div className="font-bold">{dia}</div>}

                    <div className="mt-1 space-y-1">
                        {dia &&
                            eventosPorDia(dia).map((ev) => (
                                <div
                                    key={ev.id}
                                    className={`evento-calendario evento-${ev.tipo ?? "default"}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectEvent(ev);
                                    }}
                                >
                                    {ev.titulo}
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
