import { useEffect, useState } from "react";
import TareaForm from "./components/TareaForm";

import { getTarea } from "./api/tareasApi";
import { getParcelas } from "../parcelas/api/parcelasApi";
import { getCultivos } from "../cultivos/api/cultivosApi";

import { useNavigate, useParams } from "react-router-dom";

import type { TareaAgricola } from "./types";
import type { Parcela } from "../parcelas/types";
import type { Cultivo } from "../cultivos/types";

import { useTareasStore } from "../../store/tareasStore";

export default function TareaFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addTarea, editTarea } = useTareasStore();

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
            await editTarea(Number(id), form);
        } else {
            await addTarea(form);
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
