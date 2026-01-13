// src/features/cultivos_tipo/components/CultivoTipoForm.tsx

import type { CultivoTipo, CultivoTipoCreate } from "../types";

interface Props {
    form: CultivoTipoCreate | CultivoTipo;
    setForm: (data: CultivoTipoCreate | CultivoTipo) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function CultivoTipoForm({ form, setForm, onSubmit }: Props) {
    // Helpers para arrays
    const updateArrayField = (field: "plagas" | "enfermedades", value: string) => {
        if (!value.trim()) return;
        setForm({
            ...form,
            [field]: [...(form[field] || []), value.trim()]
        });
    };

    const removeArrayItem = (field: "plagas" | "enfermedades", index: number) => {
        const updated = [...(form[field] || [])];
        updated.splice(index, 1);
        setForm({ ...form, [field]: updated });
    };

    return (
        <form
            onSubmit={onSubmit}
            className="bg-white shadow rounded-lg p-6 space-y-4"
        >
            {/* Nombre */}
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-1">
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

            {/* Nombre latín */}
            <div>
                <label htmlFor="nombre_latin" className="block text-sm font-medium mb-1">
                    Nombre latín
                </label>
                <input
                    id="nombre_latin"
                    type="text"
                    placeholder="Ej: Solanum lycopersicum"
                    className="w-full border rounded px-3 py-2"
                    value={form.nombre_latin ?? ""}
                    onChange={(e) => setForm({ ...form, nombre_latin: e.target.value })}
                />
            </div>

            {/* Variedad */}
            <div>
                <label htmlFor="variedad" className="block text-sm font-medium mb-1">
                    Variedad
                </label>
                <input
                    id="variedad"
                    type="text"
                    placeholder="Ej: Cherry, Roma, etc."
                    className="w-full border rounded px-3 py-2"
                    value={form.variedad ?? ""}
                    onChange={(e) => setForm({ ...form, variedad: e.target.value })}
                />
            </div>

            {/* Tipo */}
            <div>
                <label htmlFor="tipo" className="block text-sm font-medium mb-1">
                    Tipo
                </label>
                <select
                    id="tipo"
                    className="w-full border rounded px-3 py-2"
                    value={form.tipo ?? ""}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                >
                    <option value="">—</option>
                    <option value="Fruto">Fruto</option>
                    <option value="Hoja">Hoja</option>
                    <option value="Raíz">Raíz</option>
                    <option value="Bulbo">Bulbo</option>
                    <option value="Flor">Flor</option>
                </select>
            </div>

            {/* Fase lunar */}
            <div>
                <label htmlFor="fase_lunar" className="block text-sm font-medium mb-1">
                    Fase lunar
                </label>
                <select
                    id="fase_lunar"
                    className="w-full border rounded px-3 py-2"
                    value={form.fase_lunar ?? ""}
                    onChange={(e) => setForm({ ...form, fase_lunar: e.target.value })}
                >
                    <option value="">—</option>
                    <option value="Creciente">Creciente</option>
                    <option value="Menguante">Menguante</option>
                    <option value="Luna llena">Luna llena</option>
                    <option value="Luna nueva">Luna nueva</option>
                </select>
            </div>

            {/* Temporada óptima */}
            <div>
                <label htmlFor="temporada_optima" className="block text-sm font-medium mb-1">
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
                <label htmlFor="dias_crecimiento" className="block text-sm font-medium mb-1">
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

            {/* Litros de agua */}
            <div>
                <label htmlFor="litros_agua_semana" className="block text-sm font-medium mb-1">
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

            {/* Temperaturas */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="temperatura_minima" className="block text-sm font-medium mb-1">
                        Temp. mínima
                    </label>
                    <input
                        id="temperatura_minima"
                        type="number"
                        placeholder="Ej: 10"
                        className="w-full border rounded px-3 py-2"
                        value={form.temperatura_minima ?? ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                temperatura_minima: e.target.value ? Number(e.target.value) : null,
                            })
                        }
                    />
                </div>

                <div>
                    <label htmlFor="temperatura_optima" className="block text-sm font-medium mb-1">
                        Temp. óptima
                    </label>
                    <input
                        id="temperatura_optima"
                        type="number"
                        placeholder="Ej: 24"
                        className="w-full border rounded px-3 py-2"
                        value={form.temperatura_optima ?? ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                temperatura_optima: e.target.value ? Number(e.target.value) : null,
                            })
                        }
                    />
                </div>
            </div>

            {/* Exigencias */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="exigencia_hidrica" className="block text-sm font-medium mb-1">
                        Exigencia hídrica
                    </label>
                    <select
                        id="exigencia_hidrica"
                        className="w-full border rounded px-3 py-2"
                        value={form.exigencia_hidrica ?? ""}
                        onChange={(e) => setForm({ ...form, exigencia_hidrica: e.target.value })}
                    >
                        <option value="">—</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="exigencia_nutrientes" className="block text-sm font-medium mb-1">
                        Exigencia nutrientes
                    </label>
                    <select
                        id="exigencia_nutrientes"
                        className="w-full border rounded px-3 py-2"
                        value={form.exigencia_nutrientes ?? ""}
                        onChange={(e) => setForm({ ...form, exigencia_nutrientes: e.target.value })}
                    >
                        <option value="">—</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>
            </div>

            {/* Plagas */}
            <div>
                <label htmlFor="input-plaga" className="block text-sm font-medium mb-1">
                    Plagas
                </label>

                <div className="flex gap-2 mb-2 flex-wrap">
                    {form.plagas?.map((p, i) => (
                        <span
                            key={i}
                            className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                            {p}
                            <button
                                type="button"
                                className="text-red-600"
                                onClick={() => removeArrayItem("plagas", i)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    id="input-plaga"
                    type="text"
                    placeholder="Añadir plaga"
                    className="w-full border rounded px-3 py-2"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            updateArrayField("plagas", (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                        }
                    }}
                />
            </div>

            {/* Enfermedades */}
            <div>
                <label htmlFor="input-enfermedad" className="block text-sm font-medium mb-1">
                    Enfermedades
                </label>

                <div className="flex gap-2 mb-2 flex-wrap">
                    {form.enfermedades?.map((p, i) => (
                        <span
                            key={i}
                            className="bg-red-200 text-red-900 px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                            {p}
                            <button
                                type="button"
                                className="text-red-600"
                                onClick={() => removeArrayItem("enfermedades", i)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    id="input-enfermedad"
                    type="text"
                    placeholder="Añadir enfermedad"
                    className="w-full border rounded px-3 py-2"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            updateArrayField("enfermedades", (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                        }
                    }}
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
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Guardar
            </button>
        </form>
    );
}
