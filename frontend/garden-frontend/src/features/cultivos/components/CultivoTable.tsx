import type { Cultivo } from "../types";

interface Props {
    cultivos: Cultivo[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function CultivoTable({ cultivos, onEdit, onDelete }: Props) {
    return (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Variedad</th>
                    <th className="p-3 text-left">Temporada</th>
                    <th className="p-3 text-left">Acciones</th>
                </tr>
            </thead>

            <tbody>
                {cultivos.map((c) => (
                    <tr key={c.id} className="border-t">
                        <td className="p-3">{c.nombre}</td>
                        <td className="p-3">{c.variedad}</td>
                        <td className="p-3">{c.temporada}</td>
                        <td className="p-3 flex gap-2">
                            <button
                                onClick={() => onEdit(c.id!)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => onDelete(c.id!)}
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
