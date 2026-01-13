import { useEffect, useState } from "react";
import TareaTable from "./components/TareaTable";

import { getParcelas } from "../parcelas/api/parcelasApi";
import { getCultivosParcela } from "../cultivos_parcela/api/cultivosParcelaApi";

import { useNavigate } from "react-router-dom";

import type { Parcela } from "../parcelas/types";
import type { CultivoParcela } from "../cultivos_parcela/types";

import { useTareasStore } from "../../store/tareasStore";

import "./tareas.css";

export default function TareaListPage() {
    const { tareas, loadTareas, removeTarea } = useTareasStore();

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [cultivosParcela, setCultivosParcela] = useState<CultivoParcela[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            await loadTareas();

            const resParcelas = await getParcelas();
            const resCultivosParcela = await getCultivosParcela();

            setParcelas(resParcelas);
            setCultivosParcela(resCultivosParcela.data);
        };

        load();
    }, [loadTareas]);

    const handleDelete = async (id: number) => {
        await removeTarea(id);
    };

    return (
        <div className="tareas-bg">
            <div className="container py-4">

                {/* HEADER PASTEL AMARILLO */}
                <div className="mb-4 dashboard-page-header dashboard-card-tareas d-flex justify-content-between align-items-center">
                    <h2 className="tareas-title">Tareas agrícolas</h2>

                    <button
                        onClick={() => navigate("/tareas/nueva")}
                        className="btn btn-success opacity-75"
                    >
                        + Nueva tarea
                    </button>
                </div>

                {/* TABLA */}
                <div className="tareas-table-container">
                    <TareaTable
                        tareas={tareas}
                        parcelas={parcelas}
                        cultivosParcela={cultivosParcela}
                        onEdit={(id) => navigate(`/tareas/${id}`)}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
}
