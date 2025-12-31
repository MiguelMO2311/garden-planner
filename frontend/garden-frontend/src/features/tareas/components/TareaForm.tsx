import type { TareaAgricola } from "../types";
import type { Parcela } from "../../parcelas/types";
import type { Cultivo } from "../../cultivos/types";

interface Props {
    form: TareaAgricola;
    setForm: (data: TareaAgricola) => void;
    parcelas: Parcela[];
    cultivos: Cultivo[];
    onSubmit: (e: React.FormEvent) => void;
}

export default function TareaForm({ form, setForm, parcelas, cultivos, onSubmit }: Props) {
    return (
        <form
            onSubmit={onSubmit}
            className="bg-white shadow rounded-lg p-6 space-y-4"
        >
            {/* Título */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="titulo">
                    Título
                </label>
                <input
                    id="titulo"
                    type="text"
                    placeholder="Ej: Riego de tomates"
                    title="Título de la tarea"
                    className="w-full border rounded px-3 py-2"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                />
            </div>

            {/* Fecha */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="fecha">
                    Fecha
                </label>
                <input
                    id="fecha"
                    type="date"
                    title="Fecha de la tarea"
                    className="w-full border rounded px-3 py-2"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    required
                />
            </div>

            {/* Estado */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="estado">
                    Estado
                </label>
                <select
                    id="estado"
                    title="Estado de la tarea"
                    className="w-full border rounded px-3 py-2"
                    value={form.estado}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            estado: e.target.value as TareaAgricola["estado"],
                        })
                    }
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En progreso</option>
                    <option value="completada">Completada</option>
                </select>
            </div>

            {/* Parcela */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="parcela">
                    Parcela
                </label>
                <select
                    id="parcela"
                    title="Parcela asociada"
                    className="w-full border rounded px-3 py-2"
                    value={form.parcela_id ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            parcela_id: e.target.value ? Number(e.target.value) : null,
                        })
                    }
                >
                    <option value="">Selecciona una parcela</option>
                    {parcelas.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Cultivo */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="cultivo">
                    Cultivo
                </label>
                <select
                    id="cultivo"
                    title="Cultivo asociado"
                    className="w-full border rounded px-3 py-2"
                    value={form.cultivo_id ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            cultivo_id: e.target.value ? Number(e.target.value) : null,
                        })
                    }
                >
                    <option value="">Selecciona un cultivo</option>
                    {cultivos.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="descripcion">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    placeholder="Detalles de la tarea"
                    title="Descripción de la tarea"
                    className="w-full border rounded px-3 py-2"
                    value={form.descripcion || ""}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => history.back()}
                    className="px-4 py-2 rounded-lg bg-gray-300 text-black shadow hover:bg-gray-400 transition-colors bg-gray-300! text-black!"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors bg-blue-600! text-white!"
                >
                    Guardar tarea
                </button>


            </div>
        </form>
    );
}
