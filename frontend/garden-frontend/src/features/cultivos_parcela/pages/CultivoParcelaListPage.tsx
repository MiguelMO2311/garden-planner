// src/features/cultivos_parcela/pages/CultivoParcelaListPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCultivosParcela, deleteCultivoParcela } from "../api/cultivosParcelaApi";
import CultivoParcelaTable from "../components/CultivoParcelaTable";

import type { CultivoParcela } from "../types";
import { showToast } from "../../../utils/toast";
import "../cultivos_parcela.css";

export default function CultivoParcelaListPage() {
    const [cultivos, setCultivos] = useState<CultivoParcela[]>([]);
    const navigate = useNavigate();

    const load = async () => {
        const data = await getCultivosParcela();   // ← YA NO res.data
        setCultivos(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCultivosParcela();
            setCultivos(data);
        };
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteCultivoParcela(id);
            showToast("Cultivo eliminado", "success");
            load();
        } catch {
            showToast("Error al eliminar", "error");
        }
    };

    return (
        <div className="cultivos-bg">
            <div className="cultivos-card mb-4 d-flex justify-content-between align-items-center dashboard-page-header dashboard-card-cultivos">
                <h2 className="cultivos-title">Cultivos en Parcela</h2>

                <button
                    onClick={() => navigate("/cultivos-parcela/nuevo")}
                    className="btn btn-success opacity-75"
                >
                    + Nuevo cultivo en parcela
                </button>
            </div>

            <div className="cultivos-table-container">
                <CultivoParcelaTable
                    cultivos={cultivos}
                    onEdit={(id) => navigate(`/cultivos-parcela/${id}`)}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
