import type { TareaAgricola } from "../types";
import type { Parcela } from "../../parcelas/types";
import type { CultivoParcela } from "../../cultivos_parcela/types";

interface Props {
    tareas: TareaAgricola[];
    parcelas: Parcela[];
    cultivosParcela: (CultivoParcela & {
        cultivo_tipo?: { id: number; nombre: string };
    })[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TareaTable({
    tareas,
    parcelas,
    cultivosParcela,
    onEdit,
    onDelete,
}: Props) {
    const getParcelaNombre = (id: number | null) =>
        parcelas.find((p) => p.id === id)?.name || "—";

    const getCultivoParcelaNombre = (id: number | null) => {
        const cp = cultivosParcela.find((c) => c.id === id);
        if (!cp) return "—";
        return cp.cultivo_tipo?.nombre
            ? `${cp.cultivo_tipo.nombre} (Parcela ${cp.parcela_id})`
            : `Cultivo ${cp.id}`;
    };

    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Parcela</th>
                    <th>Cultivo en parcela</th>
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
                        <td>{getCultivoParcelaNombre(tarea.cultivo_parcela_id)}</td>

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
