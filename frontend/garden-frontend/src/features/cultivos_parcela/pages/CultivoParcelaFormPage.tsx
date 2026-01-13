// src/features/cultivos_parcela/pages/CultivoParcelaFormPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createCultivoParcela,
    getCultivoParcela,
    updateCultivoParcela,
    deleteCultivoParcela,
} from "../api/cultivosParcelaApi";

import { getCultivosTipo } from "../../cultivos_tipo/api/cultivosApi";
import { getParcelas } from "../../parcelas/api/parcelasApi";

import CultivoParcelaForm from "../components/CultivoParcelaForm";

import type { CultivoParcelaCreate, CultivoParcela } from "../types";
import type { CultivoTipo } from "../../cultivos_tipo/types";
import type { Parcela } from "../../parcelas/types";

import { showToast } from "../../../utils/toast";

export default function CultivoParcelaFormPage() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CultivoParcelaCreate>({
        cultivo_tipo_id: 0,
        parcela_id: 0,
        fecha_siembra: "",
        estado: "activo",
        plagas_detectadas: [],
        enfermedades_detectadas: [],
        riego_aplicado_semana: null,
        notas: "",
    });

    // Campo calculado por backend (solo lectura)
    const [fechaCosecha, setFechaCosecha] = useState<string>("");

    const [cultivosTipo, setCultivosTipo] = useState<CultivoTipo[]>([]);
    const [parcelas, setParcelas] = useState<Parcela[]>([]);

    useEffect(() => {
        async function loadData() {
            const [cultivosTipoRes, parcelasRes] = await Promise.all([
                getCultivosTipo(),   // devuelve CultivoTipo[]
                getParcelas(),       // devuelve Parcela[]
            ]);

            setCultivosTipo(cultivosTipoRes);
            setParcelas(parcelasRes);

            if (isEditing) {
                const cultivo: CultivoParcela = await getCultivoParcela(Number(id));

                setFormData({
                    cultivo_tipo_id: cultivo.cultivo_tipo_id,
                    parcela_id: cultivo.parcela_id,
                    fecha_siembra: cultivo.fecha_siembra ?? "",
                    fecha_muerte: cultivo.fecha_muerte ?? "",
                    estado: cultivo.estado,
                    plagas_detectadas: cultivo.plagas_detectadas ?? [],
                    enfermedades_detectadas: cultivo.enfermedades_detectadas ?? [],
                    riego_aplicado_semana: cultivo.riego_aplicado_semana ?? null,
                    notas: cultivo.notas ?? "",
                });

                setFechaCosecha(cultivo.fecha_cosecha ?? "");
            }
        }

        loadData();
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                const updated = await updateCultivoParcela(Number(id), formData);
                setFechaCosecha(updated.fecha_cosecha ?? "");
                showToast("Cultivo actualizado", "success");
            } else {
                const created = await createCultivoParcela(formData);
                setFechaCosecha(created.fecha_cosecha ?? "");
                showToast("Cultivo creado", "success");
            }

            navigate("/cultivos-parcela");
        } catch {
            showToast("Error al guardar", "error");
        }
    };

    const handleDelete = async () => {
        if (!isEditing) return;

        try {
            await deleteCultivoParcela(Number(id));
            showToast("Cultivo eliminado", "success");
            navigate("/cultivos-parcela");
        } catch {
            showToast("Error al eliminar", "error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                {isEditing ? "Editar cultivo en parcela" : "Nuevo cultivo en parcela"}
            </h2>

            <CultivoParcelaForm
                form={formData}
                setForm={setFormData}
                cultivosTipo={cultivosTipo}
                parcelas={parcelas}
                fechaCosecha={fechaCosecha}
                onSubmit={handleSubmit}
            />

            {isEditing && (
                <button
                    onClick={handleDelete}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                >
                    Eliminar
                </button>
            )}
        </div>
    );
}
