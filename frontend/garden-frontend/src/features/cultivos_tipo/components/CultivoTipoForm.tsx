import { useEffect, useState } from "react";
import type { CultivoTipo, CultivoTipoCreate } from "../types";
import { getPlagas, getEnfermedades } from "../api/cultivosApi";

interface Props {
    form: CultivoTipoCreate | CultivoTipo;
    setForm: (data: CultivoTipoCreate | CultivoTipo) => void;
    onSubmit: (e: React.FormEvent) => void;
}

type Opcion = { id: number; nombre: string };

export default function CultivoTipoForm({
    form,
    setForm,
    onSubmit
}: Props) {

    // Listas cargadas desde backend
    const [plagasDisponibles, setPlagasDisponibles] = useState<Opcion[]>([]);
    const [enfermedadesDisponibles, setEnfermedadesDisponibles] = useState<Opcion[]>([]);

    // Cargar plagas y enfermedades al montar
    useEffect(() => {
        getPlagas().then((data) => setPlagasDisponibles(data));
        getEnfermedades().then((data) => setEnfermedadesDisponibles(data));
    }, []);

    return (
        <form
            onSubmit={onSubmit}
            className="bg-white shadow rounded-lg p-6 space-y-4"
        >
            {/* Nombre */}
            <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                />
            </div>

            {/* Nombre latín */}
            <div>
                <label className="block text-sm font-medium mb-1">Nombre latín</label>
                <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={form.nombre_latin ?? ""}
                    onChange={(e) => setForm({ ...form, nombre_latin: e.target.value })}
                />
            </div>

            {/* Variedad */}
            <div>
                <label className="block text-sm font-medium mb-1">Variedad</label>
                <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={form.variedad ?? ""}
                    onChange={(e) => setForm({ ...form, variedad: e.target.value })}
                />
            </div>

            {/* Tipo */}
            <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
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
                    <option value="Árbol">Árbol</option>
                    <option value="Leguminosa">Leguminosa</option>
                    <option value="Tubérculo">Tubérculo</option>
                    <option value="Aromática">Aromática</option>
                </select>
            </div>

            {/* Fase lunar */}
            <div>
                <label className="block text-sm font-medium mb-1">Fase lunar</label>
                <select
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
                <label className="block text-sm font-medium mb-1">Temporada óptima</label>
                <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={form.temporada_optima ?? ""}
                    onChange={(e) => setForm({ ...form, temporada_optima: e.target.value })}
                />
            </div>

            {/* Días de crecimiento */}
            <div>
                <label className="block text-sm font-medium mb-1">Días de crecimiento</label>
                <input
                    type="number"
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
                <label className="block text-sm font-medium mb-1">Litros/semana</label>
                <input
                    type="number"
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
                    <label className="block text-sm font-medium mb-1">Temp. mínima</label>
                    <input
                        type="number"
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
                    <label className="block text-sm font-medium mb-1">Temp. óptima</label>
                    <input
                        type="number"
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
                    <label className="block text-sm font-medium mb-1">Exigencia hídrica</label>
                    <select
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
                    <label className="block text-sm font-medium mb-1">Exigencia nutrientes</label>
                    <select
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
                <label className="block text-sm font-medium mb-1">Plagas</label>
                <select
                    multiple
                    className="w-full border rounded px-3 py-2 h-32"
                    value={form.plagas}
                    onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, opt => opt.value);
                        setForm({ ...form, plagas: values });
                    }}
                >
                    {plagasDisponibles.map((p) => (
                        <option key={p.id} value={p.nombre}>
                            {p.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Enfermedades */}
            <div>
                <label className="block text-sm font-medium mb-1">Enfermedades</label>
                <select
                    multiple
                    className="w-full border rounded px-3 py-2 h-32"
                    value={form.enfermedades}
                    onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, opt => opt.value);
                        setForm({ ...form, enfermedades: values });
                    }}
                >
                    {enfermedadesDisponibles.map((e2) => (
                        <option key={e2.id} value={e2.nombre}>
                            {e2.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Notas */}
            <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <textarea
                    className="w-full border rounded px-3 py-2"
                    value={form.notas ?? ""}
                    onChange={(e) => setForm({ ...form, notas: e.target.value })}
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
