import { Link } from "react-router-dom";
import type { Parcela } from "../types";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface Props {
    parcelas: Parcela[];
    onDelete: (id: number) => void;
}

export default function ParcelaTable({ parcelas, onDelete }: Props) {
    return (
        <div className="card shadow-sm border-0">
            <table className="table table-hover align-middle mb-0">
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
                            {/* Nombre */}
                            <td className="fw-semibold">{p.name}</td>

                            {/* Tamaño con badge */}
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

                            {/* Ubicación */}
                            <td>{p.location || "-"}</td>

                            {/* Tipo de suelo con badge */}
                            <td>
                                {p.soil_type ? (
                                    <span className="badge bg-info text-dark">
                                        {p.soil_type}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </td>

                            {/* Acciones */}
                            <td className="text-end">

                                {/* Ver detalle */}
                                <Link
                                    to={`/parcelas/${p.id}`}
                                    className="btn btn-sm btn-outline-info me-2"
                                    title="Ver detalle"
                                >
                                    <FaEye />
                                </Link>

                                {/* Editar */}
                                <Link
                                    to={`/parcelas/${p.id}/editar`}
                                    className="btn btn-sm btn-outline-primary me-2"
                                    title="Editar parcela"
                                >
                                    <FaEdit />
                                </Link>

                                {/* Borrar */}
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

