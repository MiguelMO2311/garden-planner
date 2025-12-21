import type { Parcela } from "../types";

interface Props {
    parcelas: Parcela[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ParcelaTable({ parcelas, onEdit, onDelete }: Props) {
    return (
        <div className="card shadow-sm">
            <table className="table table-hover mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Tamaño (m²)</th>
                        <th>Ubicación</th>
                        <th>Tipo de suelo</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {parcelas.map((p) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.size_m2 || "-"}</td>
                            <td>{p.location || "-"}</td>
                            <td>{p.soil_type || "-"}</td>

                            <td className="text-end">
                                <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => onEdit(p.id)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => onDelete(p.id)}
                                >
                                    Borrar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
