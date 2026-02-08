// src/features/cultivos_parcela/components/CultivoParcelaForm.tsx

import type { CultivoParcelaFormData } from "../types";
import type { CultivoTipo } from "../../cultivos_tipo/types";
import type { Parcela } from "../../parcelas/types";
import type { Plaga, Enfermedad } from "../../sanitario/types";

interface Props {
    form: CultivoParcelaFormData;
    setForm: (data: CultivoParcelaFormData) => void;
    cultivosTipo: CultivoTipo[];
    parcelas: Parcela[];
    plagas: Plaga[];
    enfermedades: Enfermedad[];
    fechaCosecha: string;
    onSubmit: (e: React.FormEvent) => void;
    isEditing: boolean;
}

export default function CultivoParcelaForm({
    form,
    setForm,
    cultivosTipo,
    parcelas,
    plagas,
    enfermedades,
    fechaCosecha,
    onSubmit,
    isEditing,
}: Props) {

    const addArrayItem = (
        field: "plagas_detectadas" | "enfermedades_detectadas",
        value: string
    ) => {
        if (!value.trim()) return;
        setForm({
            ...form,
            [field]: [...(form[field] || []), value.trim()],
        });
    };

    const removeArrayItem = (
        field: "plagas_detectadas" | "enfermedades_detectadas",
        index: number
    ) => {
        const updated = [...(form[field] || [])];
        updated.splice(index, 1);
        setForm({ ...form, [field]: updated });
    };

    return (
        <form onSubmit={onSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">

            {/* Tipo de cultivo */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Tipo de cultivo
                </label>

                {isEditing ? (
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
                        value={form.cultivo_tipo?.nombre || "Cultivo desconocido"}
                        disabled
                        title="Tipo de cultivo asignado"
                        aria-label="Tipo de cultivo asignado"
                    />
                ) : (
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={form.cultivo_tipo_id}
                        title="Seleccionar tipo de cultivo"
                        aria-label="Seleccionar tipo de cultivo"
                        onChange={(e) =>
                            setForm({ ...form, cultivo_tipo_id: Number(e.target.value) })
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
                )}
            </div>

            {/* Parcela */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Parcela
                </label>

                <select
                    className="w-full border rounded px-3 py-2"
                    value={form.parcela_id}
                    title="Seleccionar parcela"
                    aria-label="Seleccionar parcela"
                    onChange={(e) =>
                        setForm({ ...form, parcela_id: Number(e.target.value) })
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
                <label className="block text-sm font-medium mb-1">
                    Fecha de siembra
                </label>

                <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    title="Fecha de siembra"
                    aria-label="Fecha de siembra"
                    value={form.fecha_siembra ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, fecha_siembra: e.target.value })
                    }
                />
            </div>

            {/* Fecha de cosecha */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Fecha de cosecha (automática)
                </label>

                <input
                    type="date"
                    className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
                    value={fechaCosecha || ""}
                    disabled
                    title="Fecha de cosecha calculada automáticamente"
                    aria-label="Fecha de cosecha calculada automáticamente"
                />
            </div>

            {/* Fecha de muerte */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Fecha de muerte
                </label>

                <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    title="Fecha de muerte"
                    aria-label="Fecha de muerte"
                    value={form.fecha_muerte ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, fecha_muerte: e.target.value })
                    }
                />
            </div>

            {/* Estado */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Estado
                </label>

                <select
                    className="w-full border rounded px-3 py-2"
                    value={form.estado}
                    title="Estado del cultivo"
                    aria-label="Estado del cultivo"
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
                <label className="block text-sm font-medium mb-1">
                    Plagas detectadas
                </label>

                <div className="flex gap-2 mb-2 flex-wrap">
                    {form.plagas_detectadas.map((p, i) => (
                        <span
                            key={i}
                            className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                            {p}
                            <button
                                type="button"
                                className="text-red-600"
                                onClick={() =>
                                    removeArrayItem("plagas_detectadas", i)
                                }
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <select
                    className="w-full border rounded px-3 py-2"
                    value=""
                    title="Seleccionar plaga detectada"
                    aria-label="Seleccionar plaga detectada"
                    onChange={(e) => {
                        const value = e.target.value;
                        if (
                            value &&
                            !form.plagas_detectadas.includes(value)
                        ) {
                            addArrayItem("plagas_detectadas", value);
                        }
                    }}
                >
                    <option value="">Añadir plaga detectada</option>

                    {plagas.map((p) => (
                        <option key={p.id} value={p.nombre}>
                            {p.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Enfermedades detectadas */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Enfermedades detectadas
                </label>

                <div className="flex gap-2 mb-2 flex-wrap">
                    {form.enfermedades_detectadas.map((p, i) => (
                        <span
                            key={i}
                            className="bg-red-200 text-red-900 px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                            {p}
                            <button
                                type="button"
                                className="text-red-600"
                                onClick={() =>
                                    removeArrayItem("enfermedades_detectadas", i)
                                }
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <select
                    className="w-full border rounded px-3 py-2"
                    value=""
                    title="Seleccionar enfermedad detectada"
                    aria-label="Seleccionar enfermedad detectada"
                    onChange={(e) => {
                        const value = e.target.value;
                        if (
                            value &&
                            !form.enfermedades_detectadas.includes(value)
                        ) {
                            addArrayItem("enfermedades_detectadas", value);
                        }
                    }}
                >
                    <option value="">Añadir enfermedad detectada</option>

                    {enfermedades.map((e) => (
                        <option key={e.id} value={e.nombre}>
                            {e.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Riego */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Riego aplicado esta semana (L)
                </label>

                <input
                    type="number"
                    step="0.1"
                    className="w-full border rounded px-3 py-2"
                    title="Riego aplicado esta semana"
                    aria-label="Riego aplicado esta semana"
                    value={form.riego_aplicado_semana ?? ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            riego_aplicado_semana: e.target.value
                                ? Number(e.target.value)
                                : null,
                        })
                    }
                />
            </div>

            {/* Notas */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Notas
                </label>

                <textarea
                    className="w-full border rounded px-3 py-2"
                    title="Notas adicionales"
                    aria-label="Notas adicionales"
                    value={form.notas ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, notas: e.target.value })
                    }
                />
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