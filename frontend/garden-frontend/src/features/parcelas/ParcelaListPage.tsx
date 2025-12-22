import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import ParcelaTable from "./components/ParcelaTable";
import { getParcelas, deleteParcela } from "./api/parcelasApi";
import { useNavigate } from "react-router-dom";
import type { Parcela } from "./types";
import "./parcelas.css";

export default function ParcelaListPage() {
    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const res = await getParcelas();
            setParcelas(res.data);
        };

        fetch();
    }, []);

    const handleDelete = async (id: number) => {
        await deleteParcela(id);

        const res = await getParcelas();
        setParcelas(res.data);
    };

    return (
        <DashboardLayout>
            <div className="parcelas-bg">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Parcelas</h2>

                    <button
                        onClick={() => navigate("/parcelas/nueva")}
                        className="px-4 py-2 bg-green-600 text-white rounded"
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
        </DashboardLayout>
    );
}
