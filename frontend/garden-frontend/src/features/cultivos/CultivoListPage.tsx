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
        <div className="cultivos-bg">
            <div className="cultivos-card mb-4 d-flex justify-content-between align-items-center">
                <h2 className="cultivos-title">Cultivos</h2>
                <button
                    onClick={() => navigate("/cultivos/nuevo")}
                    className="btn btn-success"
                >
                    + Nuevo cultivo
                </button>
            </div>

            <div className="cultivos-table-container">
                <CultivoTable
                    cultivos={cultivos}
                    onEdit={(id) => navigate(`/cultivos/${id}`)}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
