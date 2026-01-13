import type { Parcela } from "../types";

interface Props {
    form: Parcela;
    setForm: (data: Parcela) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function ParcelaForm({ form, setForm, onSubmit }: Props) {
    return (
        <form
            onSubmit={onSubmit}
            className="dashboard-page-header dashboard-card-parcelas p-6 space-y-4 rounded-lg"
        >
            {/* Nombre */}
            <div>
                <label className="parcelas-label block text-sm font-medium mb-1">
                    Nombre
                </label>
                <input
                    type="text"
                    placeholder="Nombre de la parcela"
                    className="parcelas-input w-full border rounded px-3 py-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
            </div>

            {/* Tamaño */}
            <div>
                <label className="parcelas-label block text-sm font-medium mb-1">
                    Tamaño (m²)
                </label>
                <input
                    type="number"
                    placeholder="Tamaño en metros cuadrados"
                    className="parcelas-input w-full border rounded px-3 py-2"
                    value={form.size_m2 ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, size_m2: Number(e.target.value) })
                    }
                    required
                />
            </div>

            {/* Ubicación */}
            <div>
                <label className="parcelas-label block text-sm font-medium mb-1">
                    Ubicación
                </label>
                <input
                    type="text"
                    placeholder="Ej: Sector Norte"
                    className="parcelas-input w-full border rounded px-3 py-2"
                    value={form.location ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                    }
                />
            </div>

            {/* Tipo de suelo */}
            <div>
                <label className="parcelas-label block text-sm font-medium mb-1">
                    Tipo de suelo
                </label>
                <input
                    type="text"
                    placeholder="Ej: Arcilloso, arenoso..."
                    className="parcelas-input w-full border rounded px-3 py-2"
                    value={form.soil_type ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, soil_type: e.target.value })
                    }
                />
            </div>

            {/* BOTÓN GUARDAR */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="parcelas-btn-guardar"
                >
                    Guardar parcela
                </button>
            </div>
        </form>
    );
}
