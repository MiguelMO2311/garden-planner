import { useEffect, useState } from "react";
import TareaForm from "./components/TareaForm";

import { getTarea } from "./api/tareasApi";
import { getParcelas } from "../parcelas/api/parcelasApi";
import { getCultivosParcela } from "../cultivos_parcela/api/cultivosParcelaApi";

import { useNavigate, useParams } from "react-router-dom";

import type { TareaAgricola } from "./types";
import type { Parcela } from "../parcelas/types";
import type { CultivoParcela } from "../cultivos_parcela/types";

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
        cultivo_parcela_id: null,
    });

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [cultivosParcela, setCultivosParcela] = useState<CultivoParcela[]>([]);

    useEffect(() => {
        const load = async () => {
            // Parcelas
            const resParcelas = await getParcelas();
            setParcelas(resParcelas);

            // Cultivos en parcela
            const resCultivosParcela = await getCultivosParcela();
            setCultivosParcela(resCultivosParcela.data);

            // Si estamos editando, cargar la tarea
            if (id) {
                const resTarea = await getTarea(Number(id));
                const t = resTarea.data;

                setForm({
                    ...t,
                    parcela_id: t.parcela_id ?? null,
                    cultivo_parcela_id: t.cultivo_parcela_id ?? null,
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

        if (form.cultivo_parcela_id === null) {
            alert("Debes seleccionar un cultivo en parcela");
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
                cultivosParcela={cultivosParcela}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
