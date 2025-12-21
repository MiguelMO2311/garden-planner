import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import TareaForm from "./components/TareaForm";

import {
    createTarea,
    getTarea,
    updateTarea,
} from "./api/tareasApi";

import { getParcelas } from "../parcelas/api/parcelasApi";
import { getCultivos } from "../cultivos/api/cultivosApi";

import { useNavigate, useParams } from "react-router-dom";

import type { TareaAgricola } from "./types";
import type { Parcela } from "../parcelas/types";
import type { Cultivo } from "../cultivos/types";

export default function TareaFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<TareaAgricola>({
        titulo: "",
        fecha: "",
        estado: "pendiente",
        descripcion: "",
        parcela_id: undefined,
        cultivo_id: undefined,
    });

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [cultivos, setCultivos] = useState<Cultivo[]>([]);

    useEffect(() => {
        const load = async () => {
            // Cargar parcelas
            const resParcelas = await getParcelas();
            setParcelas(resParcelas.data);

            // Cargar cultivos
            const resCultivos = await getCultivos();
            setCultivos(resCultivos.data);

            // Si estamos editando, cargar la tarea
            if (id) {
                const resTarea = await getTarea(Number(id));
                setForm(resTarea.data);
            }
        };

        load();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (id) {
            await updateTarea(Number(id), form);
        } else {
            await createTarea(form);
        }

        navigate("/tareas");
    };

    return (
        <DashboardLayout>
            <h2 className="text-2xl font-bold mb-6">
                {id ? "Editar tarea" : "Nueva tarea"}
            </h2>

            <TareaForm
                form={form}
                setForm={setForm}
                parcelas={parcelas}
                cultivos={cultivos}
                onSubmit={handleSubmit}
            />
        </DashboardLayout>
    );
}
