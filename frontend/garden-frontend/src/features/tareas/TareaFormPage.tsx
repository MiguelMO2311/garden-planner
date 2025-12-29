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

    // Estado inicial corregido: parcela_id y cultivo_id pueden ser null
    const [form, setForm] = useState<TareaAgricola>({
        titulo: "",
        fecha: "",
        estado: "pendiente",
        descripcion: "",
        parcela_id: null,
        cultivo_id: null,
    });

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [cultivos, setCultivos] = useState<Cultivo[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                // Cargar parcelas
                const resParcelas = await getParcelas();
                setParcelas(resParcelas.data);

                // Cargar cultivos
                const resCultivos = await getCultivos();
                setCultivos(resCultivos.data);

                // Si estamos editando, cargar la tarea
                if (id) {
                    const resTarea = await getTarea(Number(id));

                    // Asegurar que parcela_id y cultivo_id nunca sean undefined
                    setForm({
                        ...resTarea.data,
                        parcela_id: resTarea.data.parcela_id ?? null,
                        cultivo_id: resTarea.data.cultivo_id ?? null,
                    });
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };

        load();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación mínima
        if (form.parcela_id === null) {
            alert("Debes seleccionar una parcela");
            return;
        }

        if (form.cultivo_id === null) {
            alert("Debes seleccionar un cultivo");
            return;
        }

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
