import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import CultivoForm from "./components/CultivoForm";
import {
    createCultivo,
    getCultivo,
    updateCultivo,
} from "./api/cultivosApi";
import { getParcelas } from "../parcelas/api/parcelasApi";
import { useNavigate, useParams } from "react-router-dom";
import type { Cultivo } from "./types";
import type { Parcela } from "../parcelas/types";

export default function CultivoFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<Cultivo>({
        nombre: "",
        temporada_optima: "",
        dias_crecimiento: undefined,
        litros_agua_semana: undefined,
        notas: "",
        plot_id: undefined,
    });

    const [parcelas, setParcelas] = useState<Parcela[]>([]);

    useEffect(() => {
        const load = async () => {
            // 1. Cargar parcelas
            const resParcelas = await getParcelas();
            setParcelas(resParcelas.data);

            // 2. Si estamos editando, cargar el cultivo
            if (id) {
                const resCultivo = await getCultivo(Number(id));
                setForm(resCultivo.data);
            }
        };

        load();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (id) {
            await updateCultivo(Number(id), form);
        } else {
            await createCultivo(form);
        }

        navigate("/cultivos");
    };

    return (
        <DashboardLayout>
            <h2 className="text-2xl font-bold mb-6">
                {id ? "Editar cultivo" : "Nuevo cultivo"}
            </h2>

            <CultivoForm
                form={form}
                setForm={setForm}
                parcelas={parcelas}
                onSubmit={handleSubmit}
            />
        </DashboardLayout>
    );
}
