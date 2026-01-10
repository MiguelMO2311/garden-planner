import type { TareaAgricola } from "../types";
import type { Parcela } from "../../parcelas/types";
import { formatFecha } from "../../../utils/formatFecha";



interface Props {
    tareas: TareaAgricola[];
    parcelas: Parcela[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TareaTable({
    tareas,
    parcelas,
    onEdit,
    onDelete,
}: Props) {
    const getParcelaNombre = (id: number | null) =>
        parcelas.find((p) => p.id === id)?.name || "—";

    const getCultivoParcelaNombre = (tarea: TareaAgricola) => {
        const cp = tarea.cultivo_parcela;
        if (!cp) return "—";

        const cultivo = cp.cultivo_tipo?.nombre ?? "Cultivo";
        const parcela = cp.parcela?.name ?? "Sin parcela";

        return `${cultivo} (Parcela ${parcela})`;
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
                        <td>{formatFecha(tarea.fecha)}</td>
                        <td>{tarea.estado}</td>

                        {/* Parcela de la tarea */}
                        <td>{getParcelaNombre(tarea.parcela_id)}</td>

                        {/* Cultivo en parcela con nombre real de la parcela */}
                        <td>{getCultivoParcelaNombre(tarea)}</td>

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
