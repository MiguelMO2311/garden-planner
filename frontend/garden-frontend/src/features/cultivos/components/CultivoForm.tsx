import type { Cultivo } from "../types";
import type { Parcela } from "../../parcelas/types";

interface Props {
    form: Cultivo;
    setForm: (data: Cultivo) => void;
    parcelas: Parcela[];
    onSubmit: (e: React.FormEvent) => void;
}

export default function CultivoForm({ form, setForm, parcelas, onSubmit }: Props) {
    return (
        <form
            onSubmit={onSubmit}
            className="bg-white shadow rounded-lg p-6 space-y-4"
        >
            {/* Nombre */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="nombre">
                    Nombre
                </label>
                <input
                    id="nombre"
                    type="text"
                    placeholder="Nombre del cultivo"
                    className="w-full border rounded px-3 py-2"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                />
            </div>

            {/* Temporada óptima */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="temporada_optima">
                    Temporada óptima
                </label>
                <input
                    id="temporada_optima"
                    type="text"
                    placeholder="Primavera, verano, etc."
                    className="w-full border rounded px-3 py-2"
                    value={form.temporada_optima ?? ""}
                    onChange={(e) => setForm({ ...form, temporada_optima: e.target.value })}
                />
            </div>

            {/* Días de crecimiento */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="dias_crecimiento">
                    Días de crecimiento
                </label>
                <input
                    id="dias_crecimiento"
                    type="number"
                    placeholder="Ej: 90"
                    className="w-full border rounded px-3 py-2"
                    value={form.dias_crecimiento ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            dias_crecimiento: e.target.value ? Number(e.target.value) : undefined,
                        })
                    }
                />
            </div>

            {/* Litros de agua por semana */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="litros_agua_semana">
                    Litros de agua por semana
                </label>
                <input
                    id="litros_agua_semana"
                    type="number"
                    step="0.1"
                    placeholder="Ej: 12.5"
                    className="w-full border rounded px-3 py-2"
                    value={form.litros_agua_semana ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            litros_agua_semana: e.target.value ? Number(e.target.value) : undefined,
                        })
                    }
                />
            </div>

            {/* Notas */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="notas">
                    Notas
                </label>
                <textarea
                    id="notas"
                    placeholder="Notas adicionales"
                    className="w-full border rounded px-3 py-2"
                    value={form.notas ?? ""}
                    onChange={(e) => setForm({ ...form, notas: e.target.value })}
                />
            </div>

            {/* Parcela */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="plot_id">
                    Parcela
                </label>
                <select
                    id="plot_id"
                    className="w-full border rounded px-3 py-2"
                    value={form.plot_id ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            plot_id: e.target.value ? Number(e.target.value) : undefined,
                        })
                    }
                >
                    <option value="">Sin parcela asignada</option>
                    {parcelas.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Botón */}
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Guardar
            </button>
        </form>
    );
}
