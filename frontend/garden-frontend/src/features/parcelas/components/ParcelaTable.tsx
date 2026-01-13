import { Link } from "react-router-dom";
import type { Parcela } from "../types";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface Props {
    parcelas: Parcela[];
    onDelete: (id: number) => void;
}

export default function ParcelaTable({ parcelas, onDelete }: Props) {
    return (
        <div className="parcelas-table-wrapper rounded-lg p-3">
            <table className="table table-hover align-middle mb-0 parcelas-table-container">
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th className="text-center">Tamaño</th>
                        <th>Ubicación</th>
                        <th>Suelo</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {parcelas.map((p) => (
                        <tr key={p.id}>
                            <td className="fw-semibold">{p.name}</td>

                            <td className="text-center">
                                <span
                                    className={`badge rounded-pill bg-${p.size_m2 && p.size_m2 > 50
                                        ? "success"
                                        : p.size_m2 && p.size_m2 > 20
                                            ? "warning"
                                            : "secondary"
                                        }`}
                                >
                                    {p.size_m2 ? `${p.size_m2} m²` : "-"}
                                </span>
                            </td>

                            <td>{p.location || "-"}</td>

                            <td>
                                {p.soil_type ? (
                                    <span className="badge bg-info text-dark">
                                        {p.soil_type}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </td>

                            <td className="text-end">
                                <Link
                                    to={`/parcelas/${p.id}`}
                                    className="btn btn-sm btn-outline-info me-2"
                                    title="Ver detalle"
                                >
                                    <FaEye />
                                </Link>

                                <Link
                                    to={`/parcelas/${p.id}/editar`}
                                    className="btn btn-sm btn-outline-primary me-2"
                                    title="Editar parcela"
                                >
                                    <FaEdit />
                                </Link>

                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => onDelete(p.id)}
                                    title="Eliminar parcela"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
