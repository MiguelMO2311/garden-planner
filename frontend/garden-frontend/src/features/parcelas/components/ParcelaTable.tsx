import type { Parcela } from "../types";

interface Props {
    parcelas: Parcela[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ParcelaTable({ parcelas, onEdit, onDelete }: Props) {
    return (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Tamaño</th>
                    <th className="p-3 text-left">Acciones</th>
                </tr>
            </thead>

            <tbody>
                {parcelas.map((p) => (
                    <tr key={p.id} className="border-t">
                        <td className="p-3">{p.nombre}</td>
                        <td className="p-3">{p.tamano} m²</td>
                        <td className="p-3 flex gap-2">
                            <button
                                onClick={() => onEdit(p.id!)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => onDelete(p.id!)}
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
