// src/features/cultivos_parcela/components/CultivoParcelaForm.tsx

import type { CultivoParcela, CultivoParcelaCreate } from "../types";
import type { CultivoTipo } from "../../cultivos_tipo/types";
import type { Parcela } from "../../parcelas/types";

interface Props {
    form: CultivoParcelaCreate | CultivoParcela;
    setForm: (data: CultivoParcelaCreate | CultivoParcela) => void;
    cultivosTipo: CultivoTipo[];
    parcelas: Parcela[];
    fechaCosecha: string; // solo lectura
    onSubmit: (e: React.FormEvent) => void;
}

export default function CultivoParcelaForm({
    form,
    setForm,
    cultivosTipo,
    parcelas,
    fechaCosecha,
    onSubmit,
}: Props) {
    // Helpers para arrays
    const addArrayItem = (field: "plagas_detectadas" | "enfermedades_detectadas", value: string) => {
        if (!value.trim()) return;
        setForm({
            ...form,
            [field]: [...(form[field] || []), value.trim()],
        });
    };

    const removeArrayItem = (field: "plagas_detectadas" | "enfermedades_detectadas", index: number) => {
        const updated = [...(form[field] || [])];
        updated.splice(index, 1);
        setForm({ ...form, [field]: updated });
    };

    return (
        <form onSubmit={onSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
            {/* Cultivo tipo */}
            <div>
                <label htmlFor="cultivo_tipo_id" className="block text-sm font-medium mb-1">
                    Tipo de cultivo
                </label>

                <select
                    id="cultivo_tipo_id"
                    className="w-full border rounded px-3 py-2"
                    value={form.cultivo_tipo_id}
                    onChange={(e) => setForm({ ...form, cultivo_tipo_id: Number(e.target.value) })}
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
                <label htmlFor="parcela_id" className="block text-sm font-medium mb-1">
                    Parcela
                </label>

                <select
                    id="parcela_id"
                    className="w-full border rounded px-3 py-2"
                    value={form.parcela_id}
                    onChange={(e) => setForm({ ...form, parcela_id: Number(e.target.value) })}
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
                <label htmlFor="fecha_siembra" className="block text-sm font-medium mb-1">
                    Fecha de siembra
                </label>

                <input
                    id="fecha_siembra"
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={form.fecha_siembra ?? ""}
                    onChange={(e) => setForm({ ...form, fecha_siembra: e.target.value })}
                />
            </div>

            {/* Fecha de cosecha (solo lectura) */}
            <div>
                <label htmlFor="fecha_cosecha" className="block text-sm font-medium mb-1">
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

            {/* Fecha de muerte */}
            <div>
                <label htmlFor="fecha_muerte" className="block text-sm font-medium mb-1">
                    Fecha de muerte (si aplica)
                </label>

                <input
                    id="fecha_muerte"
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={form.fecha_muerte ?? ""}
                    onChange={(e) => setForm({ ...form, fecha_muerte: e.target.value })}
                />
            </div>

            {/* Estado */}
            <div>
                <label htmlFor="estado" className="block text-sm font-medium mb-1">
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

            {/* Plagas detectadas */}
            <div>
                <label htmlFor="input-plaga" className="block text-sm font-medium mb-1">
                    Plagas detectadas
                </label>

                <div className="flex gap-2 mb-2 flex-wrap">
                    {form.plagas_detectadas?.map((p, i) => (
                        <span
                            key={i}
                            className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                            {p}
                            <button
                                type="button"
                                className="text-red-600"
                                onClick={() => removeArrayItem("plagas_detectadas", i)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    id="input-plaga"
                    type="text"
                    placeholder="Añadir plaga detectada"
                    className="w-full border rounded px-3 py-2"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("plagas_detectadas", (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                        }
                    }}
                />
            </div>

            {/* Enfermedades detectadas */}
            <div>
                <label htmlFor="input-enfermedad" className="block text-sm font-medium mb-1">
                    Enfermedades detectadas
                </label>

                <div className="flex gap-2 mb-2 flex-wrap">
                    {form.enfermedades_detectadas?.map((p, i) => (
                        <span
                            key={i}
                            className="bg-red-200 text-red-900 px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                            {p}
                            <button
                                type="button"
                                className="text-red-600"
                                onClick={() => removeArrayItem("enfermedades_detectadas", i)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    id="input-enfermedad"
                    type="text"
                    placeholder="Añadir enfermedad detectada"
                    className="w-full border rounded px-3 py-2"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("enfermedades_detectadas", (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                        }
                    }}
                />
            </div>

            {/* Riego aplicado */}
            <div>
                <label htmlFor="riego_aplicado_semana" className="block text-sm font-medium mb-1">
                    Riego aplicado esta semana (L)
                </label>

                <input
                    id="riego_aplicado_semana"
                    type="number"
                    step="0.1"
                    className="w-full border rounded px-3 py-2"
                    value={form.riego_aplicado_semana ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            riego_aplicado_semana: e.target.value ? Number(e.target.value) : null,
                        })
                    }
                />
            </div>

            {/* Notas */}
            <div>
                <label htmlFor="notas" className="block text-sm font-medium mb-1">
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
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Guardar
            </button>
        </form>
    );
}
