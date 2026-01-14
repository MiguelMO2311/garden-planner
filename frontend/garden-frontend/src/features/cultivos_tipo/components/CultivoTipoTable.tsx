// src/features/cultivos_tipo/components/CultivoTipoTable.tsx

import type { CultivoTipo } from "../types";

interface Props {
    cultivos: CultivoTipo[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function CultivoTipoTable({ cultivos, onEdit, onDelete }: Props) {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle small">
                <thead>
                    <tr>
                        <th className="col-2">Nombre</th>
                        <th className="col-1">Tipo</th>
                        <th className="col-1">Fase lunar</th>
                        <th className="col-2">Plagas</th>
                        <th className="col-2">Enfermedades</th>
                        <th className="col-1">Temp. mín</th>
                        <th className="col-1">Temp. óptima</th>
                        <th className="col-1">L/sem</th>
                        <th className="col-2">Notas</th>
                        <th className="col-1">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {cultivos.map((cultivo) => (
                        <tr key={cultivo.id}>
                            <td className="text-truncate">{cultivo.nombre}</td>
                            <td className="text-truncate">{cultivo.tipo || "—"}</td>
                            <td className="text-truncate">{cultivo.fase_lunar || "—"}</td>

                            {/* Plagas */}
                            <td className="text-wrap" style={{ fontSize: "0.75rem" }}>
                                {cultivo.plagas.length > 0 ? (
                                    cultivo.plagas.map((p, i) => (
                                        <span
                                            key={i}
                                            className="badge bg-warning text-dark me-1 mb-1"
                                            style={{ fontSize: "0.65rem" }}
                                        >
                                            {p}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                            </td>

                            {/* Enfermedades */}
                            <td className="text-wrap" style={{ fontSize: "0.75rem" }}>
                                {cultivo.enfermedades.length > 0 ? (
                                    cultivo.enfermedades.map((e, i) => (
                                        <span
                                            key={i}
                                            className="badge bg-danger text-light me-1 mb-1"
                                            style={{ fontSize: "0.65rem" }}
                                        >
                                            {e}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                            </td>

                            <td>{cultivo.temperatura_minima ?? "—"}</td>
                            <td>{cultivo.temperatura_optima ?? "—"}</td>
                            <td>{cultivo.litros_agua_semana ?? "—"}</td>

                            {/* Notas con tooltip */}
                            <td
                                className="notas-tooltip text-truncate"
                                data-tooltip={cultivo.notas || "—"}
                            >
                                {cultivo.notas || "—"}
                            </td>   
                            
                            <td className="d-flex gap-1">
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
        </div>
    );
}
