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
            className="bg-white shadow rounded-lg p-6 space-y-4"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre de la parcela"
                    className="w-full border rounded px-3 py-2"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Tamaño (m²)</label>
                <input
                    type="number"
                    placeholder="Tamaño en metros cuadrados"
                    className="w-full border rounded px-3 py-2"
                    value={form.tamano}
                    onChange={(e) =>
                        setForm({ ...form, tamano: Number(e.target.value) })
                    }
                    required
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
