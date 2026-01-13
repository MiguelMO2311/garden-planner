// src/features/cultivos_tipo/pages/CultivoTipoListPage.tsx

import { useEffect, useState } from "react";
import CultivoTipoTable from "../components/CultivoTipoTable";
import { getCultivosTipo, deleteCultivoTipo } from "../api/cultivosApi";
import { useNavigate } from "react-router-dom";
import type { CultivoTipo } from "../types";
import { showToast } from "../../../utils/toast";
import "../cultivos_tipo.css";

export default function CultivoTipoListPage() {
    const [cultivos, setCultivos] = useState<CultivoTipo[]>([]);
    const navigate = useNavigate();

    const load = async () => {
        const data = await getCultivosTipo();   // ← ahora devuelve directamente el array
        setCultivos(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            await load();
        };
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteCultivoTipo(id);
            showToast("Cultivo eliminado correctamente", "success");
            load();
        } catch {
            showToast("Error al eliminar el cultivo", "error");
        }
    };

    return (
        <div className="cultivos-bg">
            <div className="cultivos-card mb-4 d-flex justify-content-between align-items-center dashboard-page-header dashboard-card-cultivos">
                <h2 className="cultivos-title">Cultivos (Catálogo)</h2>

                <button
                    onClick={() => navigate("/cultivos-tipo/nuevo")}
                    className="btn btn-success opacity-75"
                >
                    + Nuevo cultivo
                </button>
            </div>

            <div className="cultivos-table-container">
                <CultivoTipoTable
                    cultivos={cultivos}
                    onEdit={(id) => navigate(`/cultivos-tipo/${id}`)}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
