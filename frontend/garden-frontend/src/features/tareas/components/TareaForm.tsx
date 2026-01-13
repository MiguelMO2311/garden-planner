import type { TareaAgricola } from "../types";
import type { Parcela } from "../../parcelas/types";
import type { CultivoParcela } from "../../cultivos_parcela/types";

interface Props {
    form: TareaAgricola;
    setForm: (data: TareaAgricola) => void;
    parcelas: Parcela[];
    cultivosParcela: (CultivoParcela & {
        cultivo_tipo?: { id: number; nombre: string };
    })[];
    onSubmit: (e: React.FormEvent) => void;
}

export default function TareaForm({
    form,
    setForm,
    parcelas,
    cultivosParcela,
    onSubmit,
}: Props) {
    return (
        <form
            onSubmit={onSubmit}
            className="dashboard-page-header dashboard-card-tareas p-6 space-y-4 rounded-lg"
        >
            {/* Título */}
            <div>
                <label className="tareas-label block text-sm font-medium mb-1" htmlFor="titulo">
                    Título
                </label>
                <input
                    id="titulo"
                    type="text"
                    placeholder="Ej: Riego de tomates"
                    className="tareas-input w-full border rounded px-3 py-2"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                />
            </div>

            {/* Fecha */}
            <div>
                <label className="tareas-label block text-sm font-medium mb-1" htmlFor="fecha">
                    Fecha
                </label>
                <input
                    id="fecha"
                    type="date"
                    className="tareas-input w-full border rounded px-3 py-2"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    required
                />
            </div>

            {/* Estado */}
            <div>
                <label className="tareas-label block text-sm font-medium mb-1" htmlFor="estado">
                    Estado
                </label>
                <select
                    id="estado"
                    className="tareas-input w-full border rounded px-3 py-2"
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
                <label className="tareas-label block text-sm font-medium mb-1" htmlFor="parcela">
                    Parcela
                </label>
                <select
                    id="parcela"
                    className="tareas-input w-full border rounded px-3 py-2"
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

            {/* Cultivo en parcela */}
            <div>
                <label className="tareas-label block text-sm font-medium mb-1" htmlFor="cultivo_parcela">
                    Cultivo en parcela
                </label>
                <select
                    id="cultivo_parcela"
                    className="tareas-input w-full border rounded px-3 py-2"
                    value={form.cultivo_parcela_id ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            cultivo_parcela_id: e.target.value ? Number(e.target.value) : null,
                        })
                    }
                >
                    <option value="">Selecciona un cultivo en parcela</option>

                    {cultivosParcela.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.cultivo_tipo?.nombre ?? "Cultivo"} — Parcela {c.parcela_id}
                        </option>
                    ))}
                </select>
            </div>

            {/* Descripción */}
            <div>
                <label className="tareas-label block text-sm font-medium mb-1" htmlFor="descripcion">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    placeholder="Detalles de la tarea"
                    className="tareas-input w-full border rounded px-3 py-2"
                    value={form.descripcion || ""}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => history.back()}
                    className="tareas-btn-cancelar"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    className="tareas-btn-guardar"
                >
                    Guardar tarea
                </button>
            </div>
        </form>
    );
}
