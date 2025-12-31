import { useEffect, useState } from "react";
import TareaForm from "./components/TareaForm";

import {
    createTarea,
    getTarea,
    updateTarea,
} from "./api/tareasApi";

import { createEvento } from "../calendario/api/calendarioApi";
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
        parcela_id: null,
        cultivo_id: null,
    });

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [cultivos, setCultivos] = useState<Cultivo[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const resParcelas = await getParcelas();
                setParcelas(resParcelas.data);

                const resCultivos = await getCultivos();
                setCultivos(resCultivos.data);

                if (id) {
                    const resTarea = await getTarea(Number(id));

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

            // 🔥 Crear evento automáticamente en el calendario
            await createEvento({
                titulo: form.titulo,
                fecha: form.fecha,
                tipo: "tarea",
                descripcion: form.descripcion,
                color: "#2563eb",
            });
        }

        navigate("/tareas");
        if (id) {
            await updateTarea(Number(id), form);
        } else {
            await createTarea(form);
        }

        navigate("/tareas");
    };

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4">
                {id ? "Editar tarea" : "Nueva tarea"}
            </h2>

            <TareaForm
                form={form}
                setForm={setForm}
                parcelas={parcelas}
                cultivos={cultivos}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
