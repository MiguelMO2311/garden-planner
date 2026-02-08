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

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const data = await getCultivosTipo();
            if (isMounted) setCultivos(data);
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteCultivoTipo(id);
            showToast("Cultivo eliminado correctamente", "success");

            // Recargar lista
            const data = await getCultivosTipo();
            setCultivos(data);

        } catch {
            showToast("Error al eliminar el cultivo", "error");
        }
    };

    return (
        <div className="cultivo-tipo-bg">
            <div className="cultivo-tipo-card cultivo-tipo-header cultivo-tipo-header-bg mb-4 d-flex justify-content-between align-items-center">
                <h2 className="cultivo-tipo-title">Cultivos (Catálogo)</h2>

                <button
                    onClick={() => navigate("/cultivos-tipo/nuevo")}
                    className="btn btn-success opacity-75"
                >
                    + Nuevo cultivo
                </button>
            </div>

            <div className="cultivo-tipo-table-container">
                <CultivoTipoTable
                    cultivos={cultivos}
                    onEdit={(id) => navigate(`/cultivos-tipo/${id}`)}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
