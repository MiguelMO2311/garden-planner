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
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Cultivo</th>
                    <th>Parcela</th>
                    <th>Siembra</th>
                    <th>Cosecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {cultivos.map((cultivo) => (
                    <tr key={cultivo.id}>
                        <td>{cultivo.cultivo_tipo?.nombre ?? "—"}</td>
                        <td>{cultivo.parcela?.name ?? "—"}</td>
                        <td>{formatFecha(cultivo.fecha_siembra)}</td>
                        <td>{formatFecha(cultivo.fecha_cosecha)}</td>
                        <td>{cultivo.estado}</td>

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
