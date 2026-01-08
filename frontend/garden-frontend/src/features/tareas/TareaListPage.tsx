import { useEffect, useState } from "react";
import TareaTable from "./components/TareaTable";
import { getParcelas } from "../parcelas/api/parcelasApi";
import { getCultivos } from "../cultivos/api/cultivosApi";
import { useNavigate } from "react-router-dom";

import type { Parcela } from "../parcelas/types";
import type { Cultivo } from "../cultivos/types";

import { useTareasStore } from "../../store/tareasStore";

import "./tareas.css";

export default function TareaListPage() {
    const { tareas, loadTareas, removeTarea } = useTareasStore();
    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [cultivos, setCultivos] = useState<Cultivo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            await loadTareas();

            const resParcelas = await getParcelas();
            const resCultivos = await getCultivos();

            setParcelas(resParcelas);
            setCultivos(resCultivos.data);
        };

        load();
    }, [loadTareas]);

    const handleDelete = async (id: number) => {
        await removeTarea(id);
    };

    return (
        <div className="tareas-bg">

            {/* CARD SUPERIOR */}
            <div className="tareas-card mb-4 d-flex justify-content-between align-items-center">
                <h2 className="tareas-title">Tareas agrícolas</h2>

                <button
                    onClick={() => navigate("/tareas/nueva")}
                    className="btn btn-success"
                >
                    + Nueva tarea
                </button>
            </div>

            {/* TABLA */}
            <div className="tareas-table-container">
                <TareaTable
                    tareas={tareas}
                    parcelas={parcelas}
                    cultivos={cultivos}
                    onEdit={(id) => navigate(`/tareas/${id}`)}
                    onDelete={handleDelete}
                />
            </div>

        </div>
    );
}
