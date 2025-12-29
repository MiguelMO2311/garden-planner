import type { TareaAgricola } from "../types";
import type { Parcela } from "../../parcelas/types";
import type { Cultivo } from "../../cultivos/types";

interface Props {
    tareas: TareaAgricola[];
    parcelas: Parcela[];
    cultivos: Cultivo[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TareaTable({ tareas, parcelas, cultivos, onEdit, onDelete }: Props) {

    // Parcela: usa p.name (NO p.nombre)
    const getParcelaNombre = (id: number | null | undefined) => {
        if (!id) return "—";
        const p = parcelas.find((x) => x.id === id);
        return p ? p.name : "—";
    };

    // Cultivo: usa c.nombre (NO c.variedad)
    const getCultivoNombre = (id: number | null | undefined) => {
        if (!id) return "—";
        const c = cultivos.find((x) => x.id === id);
        return c ? c.nombre : "—";
    };

    return (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 text-left">Título</th>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Parcela</th>
                    <th className="p-3 text-left">Cultivo</th>
                    <th className="p-3 text-left">Acciones</th>
                </tr>
            </thead>

            <tbody>
                {tareas.map((t) => (
                    <tr key={t.id} className="border-t">
                        <td className="p-3">{t.titulo}</td>
                        <td className="p-3">{t.fecha}</td>
                        <td className="p-3 capitalize">{t.estado.replace("_", " ")}</td>

                        {/* Parcela */}
                        <td className="p-3">{getParcelaNombre(t.parcela_id)}</td>

                        {/* Cultivo */}
                        <td className="p-3">{getCultivoNombre(t.cultivo_id)}</td>

                        {/* Acciones */}
                        <td className="p-3 flex gap-2">
                            <button
                                onClick={() => onEdit(t.id!)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => onDelete(t.id!)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
