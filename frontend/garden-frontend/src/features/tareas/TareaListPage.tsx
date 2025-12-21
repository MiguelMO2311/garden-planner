import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import TareaTable from "./components/TareaTable";
import { getTareas, deleteTarea } from "./api/tareasApi";
import { getParcelas } from "../parcelas/api/parcelasApi";
import { getCultivos } from "../cultivos/api/cultivosApi";
import { useNavigate } from "react-router-dom";
import type { TareaAgricola } from "./types";
import type { Parcela } from "../parcelas/types";
import type { Cultivo } from "../cultivos/types";

export default function TareaListPage() {
    const [tareas, setTareas] = useState<TareaAgricola[]>([]);
    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [cultivos, setCultivos] = useState<Cultivo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const resTareas = await getTareas();
            const resParcelas = await getParcelas();
            const resCultivos = await getCultivos();

            setTareas(resTareas.data);
            setParcelas(resParcelas.data);
            setCultivos(resCultivos.data);
        };

        load();
    }, []);

    const handleDelete = async (id: number) => {
        await deleteTarea(id);
        const res = await getTareas();
        setTareas(res.data);
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tareas agrícolas</h2>

                <button
                    onClick={() => navigate("/tareas/nueva")}
                    className="px-4 py-2 bg-green-600 text-white rounded"
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
        </DashboardLayout>
    );
}
