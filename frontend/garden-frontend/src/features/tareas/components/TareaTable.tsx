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
    const getParcelaNombre = (id: number | null) =>
        parcelas.find((p) => p.id === id)?.name || "—";

    const getCultivoNombre = (id: number | null) =>
        cultivos.find((c) => c.id === id)?.nombre || "—";

    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Parcela</th>
                    <th>Cultivo</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {tareas.map((tarea) => (
                    <tr key={tarea.id}>
                        <td>{tarea.titulo}</td>
                        <td>{tarea.fecha}</td>
                        <td>{tarea.estado}</td>
                        <td>{getParcelaNombre(tarea.parcela_id)}</td>
                        <td>{getCultivoNombre(tarea.cultivo_id)}</td>

                        <td className="d-flex gap-2">
                            <button
                                className="btn btn-outline-warning btn-sm"
                                onClick={() => onEdit(tarea.id!)}
                            >
                                Editar
                            </button>

                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onDelete(tarea.id!)}
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
