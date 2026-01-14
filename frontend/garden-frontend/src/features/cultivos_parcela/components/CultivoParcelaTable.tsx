// src/features/cultivos_parcela/components/CultivoParcelaTable.tsx

import type { CultivoParcela } from "../types";
import type { CultivoTipo } from "../../cultivos_tipo/types";
import type { Parcela } from "../../parcelas/types";

const formatFecha = (iso: string | null) => {
    if (!iso) return "—";
    const [año, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${año}`;
};

interface Props {
    cultivos: (CultivoParcela & {
        cultivo_tipo?: CultivoTipo;
        parcela?: Parcela;
    })[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function CultivoParcelaTable({ cultivos, onEdit, onDelete }: Props) {
    return (
        <table className="table table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th>Cultivo</th>
                    <th>Parcela</th>
                    <th>Siembra</th>
                    <th>Cosecha</th>
                    <th>Plagas</th>
                    <th>Enfermedades</th>
                    <th>Riego (L/sem)</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {cultivos.map((cultivo) => (
                    <tr key={cultivo.id}>
                        {/* Cultivo */}
                        <td>{cultivo.cultivo_tipo?.nombre ?? "—"}</td>

                        {/* Parcela */}
                        <td>{cultivo.parcela?.name ?? "—"}</td>

                        {/* Fechas */}
                        <td>{formatFecha(cultivo.fecha_siembra)}</td>
                        <td>{formatFecha(cultivo.fecha_cosecha)}</td>

                        {/* Plagas del cultivo tipo */}
                        <td>
                            {cultivo.cultivo_tipo?.plagas?.length ? (
                                cultivo.cultivo_tipo.plagas.map((p, i) => (
                                    <span
                                        key={i}
                                        className="badge bg-warning text-dark me-1"
                                    >
                                        {p}
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted">—</span>
                            )}
                        </td>

                        {/* Enfermedades del cultivo tipo */}
                        <td>
                            {cultivo.cultivo_tipo?.enfermedades?.length ? (
                                cultivo.cultivo_tipo.enfermedades.map((e, i) => (
                                    <span
                                        key={i}
                                        className="badge bg-danger text-light me-1"
                                    >
                                        {e}
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted">—</span>
                            )}
                        </td>

                        {/* Riego recomendado del cultivo tipo */}
                        <td>
                            {cultivo.cultivo_tipo?.litros_agua_semana ??
                                "—"}
                        </td>

                        {/* Estado */}
                        <td>
                            {cultivo.estado === "activo" && (
                                <span className="badge bg-success">Activo</span>
                            )}
                            {cultivo.estado === "cosechado" && (
                                <span className="badge bg-primary">Cosechado</span>
                            )}
                            {cultivo.estado === "muerto" && (
                                <span className="badge bg-secondary">Muerto</span>
                            )}
                        </td>

                        {/* Acciones */}
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
