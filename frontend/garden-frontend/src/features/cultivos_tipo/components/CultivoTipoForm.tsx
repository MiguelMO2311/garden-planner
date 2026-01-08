import type { CultivoTipo, CultivoTipoCreate } from "../types";

interface Props {
    form: CultivoTipoCreate | CultivoTipo;
    setForm: (data: CultivoTipoCreate | CultivoTipo) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function CultivoTipoForm({ form, setForm, onSubmit }: Props) {
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
                            dias_crecimiento: e.target.value ? Number(e.target.value) : null,
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
                            litros_agua_semana: e.target.value ? Number(e.target.value) : null,
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
