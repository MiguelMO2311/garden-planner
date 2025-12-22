import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import CultivoTable from "./components/CultivoTable";
import { getCultivos, deleteCultivo } from "./api/cultivosApi";
import { useNavigate } from "react-router-dom";
import type { Cultivo } from "./types";
import "./cultivos.css";

export default function CultivoListPage() {
    const [cultivos, setCultivos] = useState<Cultivo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const res = await getCultivos();
            setCultivos(res.data);
        };

        fetch();
    }, []);

    const handleDelete = async (id: number) => {
        await deleteCultivo(id);
        const res = await getCultivos();
        setCultivos(res.data);
    };

    return (
        <DashboardLayout>
            <div className="cultivos-bg">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Cultivos</h2>

                    <button
                        onClick={() => navigate("/cultivos/nuevo")}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Nuevo cultivo
                    </button>
                </div>

                <CultivoTable
                    cultivos={cultivos}
                    onEdit={(id) => navigate(`/cultivos/${id}`)}
                    onDelete={handleDelete}
                />

            </div>
        </DashboardLayout>
    );
}
