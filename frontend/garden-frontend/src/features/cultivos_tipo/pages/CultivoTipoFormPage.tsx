// src/features/cultivos_tipo/pages/CultivoTipoFormPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createCultivoTipo,
    getCultivoTipo,
    updateCultivoTipo,
    deleteCultivoTipo,
    getPlagasCatalogo,
    getEnfermedadesCatalogo,
} from "../api/cultivosApi";

import { showToast } from "../../../utils/toast";
import type { CultivoTipoCreate, CultivoTipo } from "../types";
import CultivoTipoForm from "../components/CultivoTipoForm";

export default function CultivoTipoFormPage() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CultivoTipoCreate>({
        nombre: "",
        nombre_latin: "",
        variedad: "",
        tipo: "",
        temporada_optima: "",
        dias_crecimiento: null,
        litros_agua_semana: null,
        fase_lunar: "",
        plagas: [],
        enfermedades: [],
        plazo_seguridad: null,
        frecuencia_tratamiento: null,
        temperatura_minima: null,
        temperatura_optima: null,
        exigencia_hidrica: "",
        exigencia_nutrientes: "",
        notas: "",
    });

    const [plagasCatalogo, setPlagasCatalogo] = useState<{ id: number; nombre: string }[]>([]);
    const [enfermedadesCatalogo, setEnfermedadesCatalogo] = useState<{ id: number; nombre: string }[]>([]);

    // Cargar catálogos
    useEffect(() => {
        const loadCatalogs = async () => {
            const plagas = await getPlagasCatalogo();
            const enfermedades = await getEnfermedadesCatalogo();
            setPlagasCatalogo(plagas);
            setEnfermedadesCatalogo(enfermedades);
        };
        loadCatalogs();
    }, []);

    // Cargar datos si estamos editando
    useEffect(() => {
        if (!isEditing) return;

        const fetch = async () => {
            const cultivo: CultivoTipo = await getCultivoTipo(Number(id));

            setFormData({
                nombre: cultivo.nombre ?? "",
                nombre_latin: cultivo.nombre_latin ?? "",
                variedad: cultivo.variedad ?? "",
                tipo: cultivo.tipo ?? "",
                temporada_optima: cultivo.temporada_optima ?? "",
                dias_crecimiento: cultivo.dias_crecimiento ?? null,
                litros_agua_semana: cultivo.litros_agua_semana ?? null,
                fase_lunar: cultivo.fase_lunar ?? "",
                plagas: cultivo.plagas ?? [],
                enfermedades: cultivo.enfermedades ?? [],
                plazo_seguridad: cultivo.plazo_seguridad ?? null,
                frecuencia_tratamiento: cultivo.frecuencia_tratamiento ?? null,
                temperatura_minima: cultivo.temperatura_minima ?? null,
                temperatura_optima: cultivo.temperatura_optima ?? null,
                exigencia_hidrica: cultivo.exigencia_hidrica ?? "",
                exigencia_nutrientes: cultivo.exigencia_nutrientes ?? "",
                notas: cultivo.notas ?? "",
            });
        };

        fetch();
    }, [id, isEditing]);

    const handleSubmitData = async (data: CultivoTipoCreate) => {
        try {
            if (isEditing) {
                await updateCultivoTipo(Number(id), data);
                showToast("Cultivo actualizado correctamente", "success");
            } else {
                await createCultivoTipo(data);
                showToast("Cultivo creado correctamente", "success");
            }

            navigate("/cultivos-tipo");
        } catch {
            showToast("Error al guardar el cultivo", "error");
        }
    };

    const handleDelete = async () => {
        if (!isEditing) return;

        try {
            await deleteCultivoTipo(Number(id));
            showToast("Cultivo eliminado correctamente", "success");
            navigate("/cultivos-tipo");
        } catch {
            showToast("Error al eliminar el cultivo", "error");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                    {isEditing ? "Editar cultivo" : "Nuevo cultivo"}
                </h2>

                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        Eliminar
                    </button>
                )}
            </div>

            <CultivoTipoForm
                plagasCatalogo={plagasCatalogo}
                enfermedadesCatalogo={enfermedadesCatalogo}
                form={formData}
                setForm={setFormData}
                onSubmit={handleSubmitData}
            />
        </div>
    );
}
