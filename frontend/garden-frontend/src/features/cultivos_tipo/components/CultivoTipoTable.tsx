// src/features/cultivos_tipo/components/CultivoTipoTable.tsx

import type { CultivoTipo } from "../types";

interface Props {
    cultivos: CultivoTipo[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function CultivoTipoTable({ cultivos, onEdit, onDelete }: Props) {
    return (
        <table className="table table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Fase lunar</th>
                    <th>Plagas</th>
                    <th>Enfermedades</th>
                    <th>Temp. mín</th>
                    <th>Temp. óptima</th>
                    <th>Litros/semana</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {cultivos.map((cultivo) => (
                    <tr key={cultivo.id}>
                        <td>{cultivo.nombre}</td>
                        <td>{cultivo.tipo || "—"}</td>
                        <td>{cultivo.fase_lunar || "—"}</td>

                        {/* Plagas */}
                        <td>
                            {cultivo.plagas.length > 0 ? (
                                cultivo.plagas.map((p, i) => (
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

                        {/* Enfermedades */}
                        <td>
                            {cultivo.enfermedades.length > 0 ? (
                                cultivo.enfermedades.map((e, i) => (
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

                        <td>{cultivo.temperatura_minima ?? "—"}</td>
                        <td>{cultivo.temperatura_optima ?? "—"}</td>
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
