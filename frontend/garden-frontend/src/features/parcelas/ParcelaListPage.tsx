import { useEffect, useState } from "react";
import ParcelaTable from "./components/ParcelaTable";
import { getParcelas, deleteParcela } from "./api/parcelasApi";
import { useNavigate } from "react-router-dom";
import type { Parcela } from "./types";
import "./parcelas.css";

export default function ParcelaListPage() {
    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            const res = await getParcelas();
            if (!isMounted) return;
            setParcelas(res.data);
        };

        load();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (id: number) => {
        await deleteParcela(id);

        const res = await getParcelas();
        setParcelas(res.data);
    };

    return (
        <div className="parcelas-bg p-4">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Parcelas</h2>

                <button
                    onClick={() => navigate("/parcelas/nueva")}
                    className="btn-accion"
                >
                    Nueva parcela
                </button>

            </div>

            <ParcelaTable
                parcelas={parcelas}
                onEdit={(id) => navigate(`/parcelas/${id}`)}
                onDelete={handleDelete}
            />

        </div>
    );
}
