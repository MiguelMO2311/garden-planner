import type { EventoAgricola } from "../types";

interface Props {
    form: EventoAgricola;
    setForm: (data: EventoAgricola) => void;
    onSubmit: () => void;
    onClose: () => void;
}

export default function EventModal({ form, setForm, onSubmit, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow w-96 space-y-4">
                <h2 className="text-xl font-bold">
                    {form.id ? "Editar evento" : "Nuevo evento"}
                </h2>

                <input
                    type="text"
                    placeholder="Título"
                    className="w-full border rounded px-3 py-2"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                />

                <select
                    className="w-full border rounded px-3 py-2"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as any })}
                >
                    <option value="siembra">Siembra</option>
                    <option value="riego">Riego</option>
                    <option value="poda">Poda</option>
                    <option value="cosecha">Cosecha</option>
                    <option value="tarea">Tarea</option>
                </select>

                <textarea
                    placeholder="Descripción"
                    className="w-full border rounded px-3 py-2"
                    value={form.descripcion || ""}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
                        Cancelar
                    </button>

                    <button onClick={onSubmit} className="px-3 py-1 bg-blue-600 text-white rounded">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
