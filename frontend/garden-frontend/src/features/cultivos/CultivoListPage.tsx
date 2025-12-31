import { useEffect, useState } from "react";
import CultivoTable from "./components/CultivoTable";
import { getCultivos, deleteCultivo } from "./api/cultivosApi";
import { useNavigate } from "react-router-dom";
import type { Cultivo } from "./types";
import { showToast } from "../../utils/toast";
import "./cultivos.css";

export default function CultivoListPage() {
    const [cultivos, setCultivos] = useState<Cultivo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            const res = await getCultivos();
            if (!isMounted) return;
            setCultivos(res.data);
        };

        load();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteCultivo(id);
            showToast("Cultivo eliminado correctamente", "success");

            const res = await getCultivos();
            setCultivos(res.data);
        } catch {
            showToast("Error al eliminar el cultivo", "error");
        }
    };

    return (
        <div className="cultivos-bg p-4 text-gray-900">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Cultivos</h2>

                <button
                    onClick={() => navigate("/cultivos/nuevo")}
                    className="btn-accion"
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
    );
}
