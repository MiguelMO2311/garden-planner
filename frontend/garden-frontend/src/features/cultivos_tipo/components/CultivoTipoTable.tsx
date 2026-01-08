// src/features/cultivos_tipo/components/CultivoTipoTable.tsx

import type { CultivoTipo } from "../types";

interface Props {
    cultivos: CultivoTipo[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function CultivoTipoTable({ cultivos, onEdit, onDelete }: Props) {
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Temporada óptima</th>
                    <th>Días crecimiento</th>
                    <th>Litros/semana</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {cultivos.map((cultivo) => (
                    <tr key={cultivo.id}>
                        <td>{cultivo.nombre}</td>
                        <td>{cultivo.temporada_optima || "—"}</td>
                        <td>{cultivo.dias_crecimiento ?? "—"}</td>
                        <td>{cultivo.litros_agua_semana ?? "—"}</td>
                        <td>{cultivo.notas || "—"}</td>

                        <td className="d-flex gap-2">
                            <button
                                className="btn btn-outline-warning btn-sm"
                                onClick={() => onEdit(cultivo.id)}
                            >
                                Editar
                            </button>

                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onDelete(cultivo.id)}
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
