import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getParcelas, deleteParcela } from "./api/parcelasApi";
import type { Parcela } from "./types";
import { showToast } from "../../utils/toast";
import "./parcelas.css";

export default function ParcelaListPage() {
    const navigate = useNavigate();

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getParcelas();
                setParcelas(data);
            } catch (err) {
                console.error(err);
                showToast("Error cargando parcelas", "error");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteParcela(id);
            setParcelas(parcelas.filter((p) => p.id !== id));
            showToast("Parcela eliminada", "success");
        } catch (err) {
            console.error(err);
            showToast("Error eliminando parcela", "error");
        }
    };

    if (loading) return <p className="mt-4">Cargando parcelas...</p>;

    return (
        <div className="parcelas-bg">

            <div className="parcelas-card mb-4 d-flex justify-content-between align-items-center dashboard-page-header dashboard-card-parcelas">
                <h2 className="parcelas-title">Parcelas</h2>

                <button
                    className="btn btn-primary opacity-75"
                    onClick={() => navigate("/parcelas/nueva")}
                >
                    + Nueva parcela
                </button>
            </div>

            <div className="parcelas-table-container">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Ubicación</th>
                            <th>Tamaño</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parcelas.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.location || "—"}</td>
                                <td>{p.size_m2 ? `${p.size_m2} m²` : "—"}</td>

                                <td className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => navigate(`/parcelas/${p.id}`)}
                                    >
                                        Ver
                                    </button>

                                    <button
                                        className="btn btn-outline-warning btn-sm"
                                        onClick={() => navigate(`/parcelas/${p.id}/editar`)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
