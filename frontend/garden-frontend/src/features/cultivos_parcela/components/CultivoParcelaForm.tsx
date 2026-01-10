// src/features/cultivos_parcela/components/CultivoParcelaForm.tsx

import type { CultivoParcela, CultivoParcelaCreate } from "../types";
import type { CultivoTipo } from "../../cultivos_tipo/types";
import type { Parcela } from "../../parcelas/types";

interface Props {
    form: CultivoParcelaCreate | CultivoParcela;
    setForm: (data: CultivoParcelaCreate | CultivoParcela) => void;
    cultivosTipo: CultivoTipo[];
    parcelas: Parcela[];
    fechaCosecha: string;   // ← AÑADIDO
    onSubmit: (e: React.FormEvent) => void;
}

export default function CultivoParcelaForm({
    form,
    setForm,
    cultivosTipo,
    parcelas,
    fechaCosecha,   // ← RECIBIDO AQUÍ
    onSubmit,
}: Props) {
    return (
        <form
            onSubmit={onSubmit}
            className="bg-white shadow rounded-lg p-6 space-y-4"
        >
            {/* Cultivo tipo */}
            <div>
                <label
                    htmlFor="cultivo_tipo_id"
                    className="block text-sm font-medium mb-1"
                >
                    Tipo de cultivo
                </label>

                <select
                    id="cultivo_tipo_id"
                    className="w-full border rounded px-3 py-2"
                    value={form.cultivo_tipo_id}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            cultivo_tipo_id: Number(e.target.value),
                        })
                    }
                    required
                >
                    <option value="">Selecciona un cultivo</option>
                    {cultivosTipo.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Parcela */}
            <div>
                <label
                    htmlFor="parcela_id"
                    className="block text-sm font-medium mb-1"
                >
                    Parcela
                </label>

                <select
                    id="parcela_id"
                    className="w-full border rounded px-3 py-2"
                    value={form.parcela_id}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            parcela_id: Number(e.target.value),
                        })
                    }
                    required
                >
                    <option value="">Selecciona una parcela</option>
                    {parcelas.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Fecha siembra */}
            <div>
                <label
                    htmlFor="fecha_siembra"
                    className="block text-sm font-medium mb-1"
                >
                    Fecha de siembra
                </label>

                <input
                    id="fecha_siembra"
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={form.fecha_siembra ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, fecha_siembra: e.target.value })
                    }
                />
            </div>

            {/* Fecha de cosecha (solo lectura) */}
            <div>
                <label
                    htmlFor="fecha_cosecha"
                    className="block text-sm font-medium mb-1"
                >
                    Fecha de cosecha (calculada automáticamente)
                </label>

                <input
                    id="fecha_cosecha"
                    type="date"
                    className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                    value={fechaCosecha || ""}
                    readOnly
                    disabled
                />
            </div>

            {/* Estado */}
            <div>
                <label
                    htmlFor="estado"
                    className="block text-sm font-medium mb-1"
                >
                    Estado
                </label>

                <select
                    id="estado"
                    className="w-full border rounded px-3 py-2"
                    value={form.estado ?? "activo"}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            estado: e.target.value as "activo" | "cosechado" | "muerto",
                        })
                    }
                >
                    <option value="activo">Activo</option>
                    <option value="cosechado">Cosechado</option>
                    <option value="muerto">Muerto</option>
                </select>
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Guardar
            </button>
        </form>
    );
}
