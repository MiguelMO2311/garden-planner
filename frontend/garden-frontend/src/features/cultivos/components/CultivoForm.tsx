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
                    title="Nombre del cultivo"
                    className="w-full border rounded px-3 py-2"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                />
            </div>

            {/* Variedad */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="variedad">
                    Variedad
                </label>
                <input
                    id="variedad"
                    type="text"
                    placeholder="Variedad del cultivo"
                    title="Variedad del cultivo"
                    className="w-full border rounded px-3 py-2"
                    value={form.variedad}
                    onChange={(e) => setForm({ ...form, variedad: e.target.value })}
                    required
                />
            </div>

            {/* Temporada */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="temporada">
                    Temporada
                </label>
                <input
                    id="temporada"
                    type="text"
                    placeholder="Primavera, verano, etc."
                    title="Temporada del cultivo"
                    className="w-full border rounded px-3 py-2"
                    value={form.temporada}
                    onChange={(e) => setForm({ ...form, temporada: e.target.value })}
                    required
                />
            </div>

            {/* Parcela asignada */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="parcela">
                    Parcela
                </label>
                <select
                    id="parcela"
                    title="Parcela donde se cultiva"
                    className="w-full border rounded px-3 py-2"
                    value={form.parcela_id ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            parcela_id: e.target.value ? Number(e.target.value) : undefined,
                        })
                    }
                >
                    <option value="">Sin parcela asignada</option>
                    {parcelas.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre}
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
