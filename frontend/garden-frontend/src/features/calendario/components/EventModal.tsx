import type { EventoAgricola } from "../types";

interface Props {
    form: EventoAgricola;
    setForm: (data: EventoAgricola) => void;
    onSubmit: () => void;
    onClose: () => void;
}

export default function EventModal({ form, setForm, onSubmit, onClose }: Props) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4 animate-fadeIn">
                <h2 id="modal-title" className="text-xl font-bold text-gray-800">
                    {form.id ? "Editar evento" : "Nuevo evento"}
                </h2>

                {/* TÍTULO */}
                <label htmlFor="titulo" className="text-sm font-medium text-gray-700">
                    Título
                </label>
                <input
                    id="titulo"
                    type="text"
                    placeholder="Título del evento"
                    className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                    value={form.titulo}
                    onChange={(e) =>
                        setForm({ ...form, titulo: e.target.value })
                    }
                />

                {/* FECHA */}
                <label htmlFor="fecha" className="text-sm font-medium text-gray-700">
                    Fecha
                </label>
                <input
                    id="fecha"
                    type="date"
                    className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                    value={form.fecha ? form.fecha.split("T")[0] : ""}
                    onChange={(e) =>
                        setForm({ ...form, fecha: e.target.value })
                    }
                />

                {/* TIPO */}
                <label htmlFor="tipo" className="text-sm font-medium text-gray-700">
                    Tipo de evento
                </label>
                <select
                    id="tipo"
                    className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                    value={form.tipo}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            tipo: e.target.value as EventoAgricola["tipo"],
                        })
                    }
                >
                    <option value="siembra">Siembra</option>
                    <option value="riego">Riego</option>
                    <option value="poda">Poda</option>
                    <option value="cosecha">Cosecha</option>
                    <option value="tarea">Tarea</option>
                </select>

                {/* DESCRIPCIÓN */}
                <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    placeholder="Descripción del evento"
                    className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                    value={form.descripcion || ""}
                    onChange={(e) =>
                        setForm({ ...form, descripcion: e.target.value })
                    }
                />

                {/* COLOR */}
                <label htmlFor="color" className="text-sm font-medium text-gray-700">
                    Color del evento (opcional)
                </label>
                <input
                    id="color"
                    type="color"
                    className="w-full h-10 border rounded cursor-pointer"
                    value={form.color || "#3b82f6"}
                    onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                    }
                />

                {/* BOTONES */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onSubmit}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
