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

            setParcelas(resParcelas.data);
            setCultivos(resCultivos.data);
        };

        load();
    }, [loadTareas]);

    const handleDelete = async (id: number) => {
        await removeTarea(id);
    };

    return (
        <div className="tareas-bg p-4">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tareas agrícolas</h2>

                <button
                    onClick={() => navigate("/tareas/nueva")}
                    className="btn-accion"
                >
                    Nueva tarea
                </button>

            </div>

            <TareaTable
                tareas={tareas}
                parcelas={parcelas}
                cultivos={cultivos}
                onEdit={(id) => navigate(`/tareas/${id}`)}
                onDelete={handleDelete}
            />

        </div>
    );
}
